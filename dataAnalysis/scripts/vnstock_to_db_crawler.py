import database_connector as dbc
from vnstock import Vnstock, Company, Finance, Listing
import pandas as pd
import re
import uuid
import time
from datetime import datetime
import os
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import Manager, Lock
import sys

# ----------------- Config -----------------
SAFE_DELAY = 1
RATE_LIMIT_DEFAULT = 60
RETRY_MAX = 3
RETRY_DELAY = 5
MAX_WORKERS = 10
MAX_WORKER_TASKS = 50

# Global lock for logging
log_lock = Lock()


def log(msg, highlight=False):
    """Prints a log message, with an option to highlight it."""
    prefix = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] "
    if highlight:
        # Sử dụng mã màu ANSI để làm nổi bật thông báo
        print(f"\n\033[92m{prefix}{msg}\033[0m\n")  # Mã màu xanh lá
    else:
        with log_lock:
            print(f"{prefix}{msg}")


# ----------------- Utilities -----------------
def safe_request(func, *args, **kwargs):
    """
    Handles API requests with rate limiting and retries.
    Now accepts shared variables (manager_dict and api_lock) as arguments.
    """
    manager_dict = kwargs.pop('manager_dict')
    api_lock = kwargs.pop('api_lock')
    retries = 0
    while retries < RETRY_MAX:
        with api_lock:
            current_time = time.time()
            time_to_wait = max(0, manager_dict['rate_limit_wait_until'] - current_time)
            if time_to_wait > 0:
                log(f"Đang chờ {time_to_wait:.2f} giây theo yêu cầu của tiến trình khác...")
                time.sleep(time_to_wait)
            manager_dict['rate_limit_wait_until'] = time.time() + SAFE_DELAY

        try:
            result = func(*args, **kwargs)
            return result
        except Exception as e:
            err_msg = str(e)
            if "Rate limit exceeded" in err_msg or "Vui lòng thử lại sau" in err_msg:
                match = re.search(r"thử lại sau (\d+) giây", err_msg)
                wait_time = int(match.group(1)) if match else RATE_LIMIT_DEFAULT
                with api_lock:
                    wait_time_with_buffer = wait_time + 5
                    new_wait_until = time.time() + wait_time_with_buffer
                    manager_dict['rate_limit_wait_until'] = max(manager_dict['rate_limit_wait_until'], new_wait_until)
                    log(f"Bị giới hạn rate limit. Tất cả các tiến trình sẽ chờ đến {new_wait_until:.2f} giây...")
                return pd.DataFrame()
            elif "NameResolutionError" in err_msg or "ConnectionError" in err_msg or "KeyError" in err_msg:
                retries += 1
                wait_time = RETRY_DELAY * (2 ** (retries - 1))
                log(f"Lỗi: {err_msg}. Thử lại lần {retries}/{RETRY_MAX} sau {wait_time} giây...")
                time.sleep(wait_time)
            else:
                log(f"Lỗi không xác định: {err_msg}")
                break

    log(f"Đã thử lại {RETRY_MAX} lần nhưng không thành công. Bỏ qua request.")
    return pd.DataFrame()


# ----------------- Crawl Industries -----------------
def crawl_industries_data(connection_pool, manager_dict, api_lock):
    connection = connection_pool.get_connection()
    if not connection:
        log("Không thể kết nối DB.")
        return

    listing = Listing(source='VCI')
    df = safe_request(listing.industries_icb, manager_dict=manager_dict, api_lock=api_lock)
    if df.empty:
        log("Không có dữ liệu ngành, bỏ qua.")
        connection.close()
        return
    df = df[df['level'] == 3]

    insert_query = "INSERT IGNORE INTO industry (code, name) VALUES (%s, %s)"
    data_to_insert = [(row['icb_code'], row['icb_name']) for _, row in df.iterrows()]
    try:
        dbc.execute_many(connection, insert_query, data_to_insert)
        log(f"Đã insert {len(data_to_insert)} ngành ICB level 3.")
    except Exception as e:
        log(f"Lỗi khi chèn dữ liệu ngành: {e}")
    finally:
        if connection:
            connection.close()


# ----------------- Helper functions for DB access -----------------
def get_or_create_person(connection, person_name):
    query = "SELECT id FROM person WHERE name = %s"
    result = dbc.execute_read_query(connection, query, (person_name,))
    if result:
        return result[0][0]
    else:
        person_id = str(uuid.uuid4())
        insert_query = "INSERT INTO person (id, name) VALUES (%s, %s)"
        dbc.execute_many(connection, insert_query, [(person_id, person_name)])
        return person_id


def get_or_create_financial_period(connection, year, quarter):
    query = "SELECT id FROM financial_period WHERE year=%s AND quarter=%s"
    result = dbc.execute_read_query(connection, query, (year, quarter))
    if result:
        return result[0][0]
    period_id = str(uuid.uuid4())
    insert_query = "INSERT INTO financial_period (id, year, quarter) VALUES (%s, %s, %s)"
    dbc.execute_many(connection, insert_query, [(period_id, year, quarter)])
    return period_id


# ----------------- Crawl Functions -----------------
def crawl_dividends_data(symbol, company_id, connection, manager_dict, api_lock, batch_size=20):
    company = Company(source="TCBS", symbol=symbol)
    dividends = safe_request(company.dividends, manager_dict=manager_dict, api_lock=api_lock)
    if dividends.empty:
        log(f"Công ty {symbol} không có dữ liệu cổ tức.")
        return
    data_batch = []
    for _, row in dividends.iterrows():
        try:
            issue_method = str(row.get('issue_method', '')).strip().upper()
            data_batch.append((
                str(uuid.uuid4()),
                row['cash_year'],
                row['exercise_date'],
                issue_method,
                row['cash_dividend_percentage'],
                company_id
            ))
        except Exception as e:
            log(f"Lỗi khi xử lý cổ tức công ty {symbol}, dòng: {row}, lỗi: {e}")
    if data_batch:
        insert_query = """
                       INSERT IGNORE INTO dividend
            (id, cash_year, exercise_date, method, percentage, company_id)
            VALUES (%s, %s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, data_batch)
        log(f"Đã insert {len(data_batch)} cổ tức cho công ty {symbol}")


def crawl_stock_share_holder(symbol, company_id, connection, manager_dict, api_lock, batch_size=20):
    company = Company(source="VCI", symbol=symbol)
    shareholders = safe_request(company.shareholders, manager_dict=manager_dict, api_lock=api_lock)
    if shareholders.empty:
        log(f"Công ty {symbol} không có cổ đông.")
        return
    data_batch = []
    for _, row in shareholders.iterrows():
        try:
            person_id = get_or_create_person(connection, row['share_holder'])
            data_batch.append((
                str(uuid.uuid4()),
                row['update_date'],
                row['share_own_percent'],
                row['quantity'],
                company_id,
                person_id,
            ))
        except Exception as e:
            log(f"Lỗi khi xử lý cổ đông công ty {symbol}, dòng: {row}, lỗi: {e}")
    if data_batch:
        insert_query = """
                       INSERT IGNORE INTO stock_share_holder
            (id, last_updated, percentage, quantity, company_id, shareholder_id)
            VALUES (%s, %s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, data_batch)
        log(f"Đã insert {len(data_batch)} cổ đông cho công ty {symbol}")


def crawl_board_member(symbol, company_id, connection, manager_dict, api_lock, batch_size=20):
    company = Company(source="VCI", symbol=symbol)
    officers = safe_request(company.officers, filter_by='working', manager_dict=manager_dict, api_lock=api_lock)
    if officers.empty:
        log(f"Công ty {symbol} không có board member.")
        return
    data_batch = []
    for _, row in officers.iterrows():
        try:
            person_id = get_or_create_person(connection, row['officer_name'])
            data_batch.append((
                str(uuid.uuid4()),
                row['update_date'],
                row['officer_position'],
                company_id,
                person_id,
            ))
        except Exception as e:
            log(f"Lỗi khi xử lý board member công ty {symbol}, dòng: {row}, lỗi: {e}")
    if data_batch:
        insert_query = """
                       INSERT IGNORE INTO board_member
            (id, last_updated, position, company_id, person_id)
            VALUES (%s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, data_batch)
        log(f"Đã insert {len(data_batch)} board member cho công ty {symbol}")


def get_indicator_type_map(connection):
    query = "SELECT id, name FROM indicator_type"
    rows = dbc.execute_read_query(connection, query)
    return {row[1]: row[0] for row in rows}


def crawl_indicator_values(symbol, company_id, connection, manager_dict, api_lock, batch_size=20):
    indicator_type_map = get_indicator_type_map(connection)
    finance = Finance(symbol=symbol, source="VCI")
    df = safe_request(finance.ratio, lang='vi', manager_dict=manager_dict, api_lock=api_lock)
    if df.empty:
        log(f"Công ty {symbol} không có dữ liệu chỉ số tài chính.")
        return
    data_batch = []
    col_map = {
        'P/E': 'PE', 'P/B': 'PB', 'P/S': 'PS',
        'ROE (%)': 'ROE', 'ROA (%)': 'ROA',
        'EPS (VND)': 'EPS', 'BVPS (VND)': 'BVPS',
        "Biên lợi nhuận gộp (%)": "LNG",
        "Biên lợi nhuận ròng (%)": "LNR",
        "Số CP lưu hành (Triệu CP)": "CPLH",
    }
    for idx, row in df.iterrows():
        try:
            year = int(row[('Meta', 'Năm')])
            quarter = int(row[('Meta', 'Kỳ')])
            period_id = get_or_create_financial_period(connection, year, quarter)
        except Exception as e:
            log(f"Lỗi lấy financial period công ty {symbol}, dòng {idx}: {e}")
            continue
        for col in df.columns[3:]:
            ind_name = col[1].strip() if isinstance(col, tuple) else str(col)
            indicator_enum_name = col_map.get(ind_name)
            if not indicator_enum_name or indicator_enum_name not in indicator_type_map:
                continue
            try:
                value = row[col]
                if pd.isna(value):
                    continue
                data_batch.append((
                    str(uuid.uuid4()),
                    value,
                    company_id,
                    period_id,
                    indicator_type_map[indicator_enum_name]
                ))
            except Exception as e:
                log(f"Lỗi khi xử lý indicator công ty {symbol}, cột {ind_name}, dòng {idx}: {e}")
    if data_batch:
        insert_query = """
                       INSERT IGNORE INTO indicator_value
            (id, value, company_id, financial_period_id, indicator_type_id)
            VALUES (%s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, data_batch)
        log(f"Đã insert {len(data_batch)} indicator cho công ty {symbol}")


def get_income_statements_type_map(connection):
    query = "SELECT id, name FROM income_statements_type"
    rows = dbc.execute_read_query(connection, query)
    return {row[1]: row[0] for row in rows}


def crawl_income_statements(symbol, company_id, connection, manager_dict, api_lock, batch_size=20):
    income_statements_map = get_income_statements_type_map(connection)
    finance = Finance(symbol=symbol, source="VCI")
    df = safe_request(finance.income_statement, lang='vi', manager_dict=manager_dict, api_lock=api_lock)
    if df.empty:
        log(f"Công ty {symbol} không có dữ liệu báo cáo kết quả kinh doanh.")
        return
    col_map = {
        "Lợi nhuận sau thuế của Cổ đông công ty mẹ (đồng)": "PROFIT_AFTER_TAX",
        "Doanh thu (đồng)": "NET_REVENUE",
        "Thu nhập lãi thuần": "NET_INTEREST_INCOME",
        "Lãi thuần từ hoạt động dịch vụ": "NET_FEE_AND_COMMISSION_INCOME",
        "Lãi/lỗ thuần từ hoạt động khác": "NET_OTHER_INCOME_OR_EXPENSES",
        "Chi phí lãi và các khoản tương tự": "INTEREST_AND_SIMILAR_EXPENSES",
    }
    data_batch = []
    for idx, row in df.iterrows():
        try:
            year, quarter = int(row['Năm']), int(row['Kỳ'])
            period_id = get_or_create_financial_period(connection, year, quarter)
        except Exception as e:
            log(f"Lỗi financial period công ty {symbol}, dòng {idx}: {e}")
            continue
        for df_col, enum_name in col_map.items():
            if enum_name not in income_statements_map:
                continue
            try:
                value = row.get(df_col)
                if pd.isna(value):
                    continue
                data_batch.append((
                    str(uuid.uuid4()),
                    value,
                    company_id,
                    period_id,
                    income_statements_map[enum_name]
                ))
            except Exception as e:
                log(f"Lỗi khi xử lý income statement công ty {symbol}, cột {df_col}, dòng {idx}: {e}")
    if data_batch:
        insert_query = """
                       INSERT IGNORE INTO income_statement
            (id, value, company_id, financial_period_id, income_statements_type_id)
            VALUES (%s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, data_batch)
        log(f"Đã insert {len(data_batch)} income statement cho công ty {symbol}")


def get_liabilities_and_equity_type_map(connection):
    query = "SELECT id, name FROM liabilities_and_equity_type"
    rows = dbc.execute_read_query(connection, query)
    return {row[1]: row[0] for row in rows}


def get_assets_type_map(connection):
    query = "SELECT id, name FROM assets_type"
    rows = dbc.execute_read_query(connection, query)
    return {row[1]: row[0] for row in rows}


def crawl_liabilities_and_equity_report_and_assets_report(symbol, company_id, connection, manager_dict, api_lock,
                                                          batch_size=20):
    liabilities_and_equity_map = get_liabilities_and_equity_type_map(connection)
    assets_map = get_assets_type_map(connection)
    finance = Finance(symbol=symbol, source="VCI")
    df = safe_request(finance.balance_sheet, lang='vi', manager_dict=manager_dict, api_lock=api_lock)
    if df.empty:
        log(f"Công ty {symbol} không có dữ liệu bảng cân đối kế toán.")
        return
    liabilities_col_map = {
        "VỐN CHỦ SỞ HỮU (đồng)": "EQUITY", "TỔNG CỘNG NGUỒN VỐN (đồng)": "TOTAL_CAPITAL",
        "Các khoản nợ chính phủ và NHNN Việt Nam": "GOV_AND_SBV_DEBT",
        "Tiền gửi và vay các Tổ chức tín dụng khác": "DEPOSITS_BORROWINGS_OTHERS",
        "Tiền gửi của khách hàng": "DEPOSITS_FROM_CUSTOMERS",
        "Phát hành giấy tờ có giá": "CONVERTIBLE_AND_OTHER_PAPERS",
        "Vay và nợ thuê tài chính dài hạn (đồng)": "LONG_TERM_BORROWINGS",
        "Vay và nợ thuê tài chính ngắn hạn (đồng)": "SHORT_TERM_BORROWINGS",
        "Người mua trả tiền trước ngắn hạn (đồng)": "ADVANCES_FROM_CUSTOMERS",
    }
    assets_col_map = {
        "Tiền và tương đương tiền (đồng)": "CASH_AND_CASH_EQUIVALENTS", "TỔNG CỘNG TÀI SẢN (đồng)": "TOTAL_ASSETS",
        "Tiền gửi tại ngân hàng nhà nước Việt Nam": "BALANCES_WITH_THE_SBV",
        "Tiền gửi tại các TCTD khác và cho vay các TCTD khác": "INTERBANK_PLACEMENTS_AND_LOANS",
        "Chứng khoán kinh doanh": "TRADING_SECURITIES",
        "Chứng khoán đầu tư": "INVESTMENT_SECURITIES", "Cho vay khách hàng": "LOANS_TO_CUSTOMERS",
        "Giá trị thuần đầu tư ngắn hạn (đồng)": "SHORT_TERM_INVESTMENTS",
        "Các khoản phải thu ngắn hạn (đồng)": "SHORT_TERM_RECEIVABLES",
        "Phải thu dài hạn (đồng)": "LONG_TERM_RECEIVABLES",
        "Hàng tồn kho ròng": "INVENTORIES", "Tài sản cố định (đồng)": "FIXED_ASSETS",
    }
    liabilities_batch, assets_batch = [], []
    for idx, row in df.iterrows():
        try:
            year, quarter = int(row['Năm']), int(row['Kỳ'])
            period_id = get_or_create_financial_period(connection, year, quarter)
        except Exception as e:
            log(f"Lỗi financial period công ty {symbol}, dòng {idx}: {e}")
            continue
        for df_col, enum_name in liabilities_col_map.items():
            if enum_name not in liabilities_and_equity_map: continue
            try:
                value = row.get(df_col)
                if pd.isna(value): continue
                liabilities_batch.append((
                    str(uuid.uuid4()), value, company_id, period_id, liabilities_and_equity_map[enum_name]
                ))
            except Exception as e:
                log(f"Lỗi liabilities công ty {symbol}, cột {df_col}, dòng {idx}: {e}")
        for df_col, enum_name in assets_col_map.items():
            if enum_name not in assets_map: continue
            try:
                value = row.get(df_col)
                if pd.isna(value): continue
                assets_batch.append((
                    str(uuid.uuid4()), value, company_id, period_id, assets_map[enum_name]
                ))
            except Exception as e:
                log(f"Lỗi assets công ty {symbol}, cột {df_col}, dòng {idx}: {e}")
    if liabilities_batch:
        insert_query = """
                       INSERT IGNORE INTO liabilities_and_equity_report
            (id, value, company_id, financial_period_id, liabilities_and_equity_type_id)
            VALUES (%s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, liabilities_batch)
        log(f"Đã insert {len(liabilities_batch)} liabilities cho công ty {symbol}")
    if assets_batch:
        insert_query = """
                       INSERT IGNORE INTO assets_report
            (id, value, company_id, financial_period_id, assets_type_id)
            VALUES (%s, %s, %s, %s, %s)
                       """
        dbc.execute_many(connection, insert_query, assets_batch)
        log(f"Đã insert {len(assets_batch)} assets cho công ty {symbol}")


# ----------------- Crawl Companies Function for Multiprocessing -----------------
def process_company(symbol, stock_exchange_id, industry_map, manager_dict, api_lock):
    connection_pool = dbc.create_connection_pool(pool_size=1)
    if not connection_pool:
        log(f"Tiến trình {os.getpid()} không thể tạo kết nối DB cho công ty {symbol}.")
        return

    connection = connection_pool.get_connection()
    if not connection:
        log(f"Tiến trình {os.getpid()} không thể lấy kết nối DB từ pool cho công ty {symbol}.")
        return

    try:
        company_overview = safe_request(Company(symbol=symbol, source='VCI').overview, manager_dict=manager_dict,
                                        api_lock=api_lock)
        if company_overview.empty:
            log(f"Không có dữ liệu tổng quan cho công ty {symbol}. Bỏ qua.")
            return

        profile = company_overview['company_profile'].iloc[0]
        pattern = rf"((Công ty|Ngân hàng).*?)(?=\s*\({symbol}\))"
        match = re.search(pattern, profile)
        company_name = match.group(1).strip() if match else f"Công ty {symbol}"
        industry_name = company_overview['icb_name3'].iloc[0]
        industry_code = industry_map.get(industry_name)
        company_id = str(uuid.uuid4())

        insert_company_query = """
                               INSERT IGNORE INTO company
            (id, code, name, overview, industry_code, stock_exchange_id)
            VALUES (%s, %s, %s, %s, %s, %s)
                               """
        dbc.execute_many(connection, insert_company_query,
                         [(company_id, symbol, company_name, profile, industry_code, stock_exchange_id)])
        log(f"Đã insert công ty {symbol} - {company_name} với ID {company_id}")

        crawl_dividends_data(symbol, company_id, connection, manager_dict, api_lock)
        crawl_stock_share_holder(symbol, company_id, connection, manager_dict, api_lock)
        crawl_board_member(symbol, company_id, connection, manager_dict, api_lock)
        crawl_indicator_values(symbol, company_id, connection, manager_dict, api_lock)
        crawl_income_statements(symbol, company_id, connection, manager_dict, api_lock)
        crawl_liabilities_and_equity_report_and_assets_report(symbol, company_id, connection, manager_dict, api_lock)
    except Exception as e:
        log(f"Lỗi tổng thể khi crawl công ty {symbol}: {e}")
    finally:
        if connection:
            connection.close()


def crawl_companies_data(connection_pool, manager_dict, api_lock):
    connection = connection_pool.get_connection()
    if not connection:
        log("Không thể lấy kết nối từ pool.")
        return

    ls_stock_exchange = dbc.execute_read_query(connection, "SELECT * FROM stock_exchange")
    connection.close()

    listing = Listing(source='VCI')
    df_icb = safe_request(listing.industries_icb, manager_dict=manager_dict, api_lock=api_lock)
    if df_icb.empty:
        log("Không có dữ liệu ngành ICB, không thể tiếp tục.")
        return

    df_icb = df_icb[df_icb['level'] == 3]
    industry_map = dict(zip(df_icb['icb_name'], df_icb['icb_code']))

    for stock_exchange in ls_stock_exchange:
        stock_exchange_id, stock_exchange_name = stock_exchange[0], stock_exchange[1]
        df_symbols = safe_request(listing.symbols_by_group, stock_exchange_name, manager_dict=manager_dict,
                                  api_lock=api_lock)
        if df_symbols.empty:
            log(f"Không có dữ liệu mã cổ phiếu cho sàn {stock_exchange_name}. Bỏ qua.")
            continue
        symbols_to_crawl = [s for s in df_symbols if len(s) == 3]

        with ProcessPoolExecutor(max_workers=MAX_WORKERS) as executor:
            log(f"Bắt đầu crawl đa tiến trình trên sàn {stock_exchange_name} với {len(symbols_to_crawl)} mã cổ phiếu...")
            future_tasks = {executor.submit(process_company, symbol, stock_exchange_id, industry_map, manager_dict,
                                            api_lock) for symbol in symbols_to_crawl}
            for future in as_completed(future_tasks):
                try:
                    future.result()
                except Exception as exc:
                    log(f"Một tiến trình đã gặp lỗi: {exc}")
        log(f"Đã hoàn thành crawl dữ liệu cho sàn {stock_exchange_name}.", highlight=True)

    log("Hoàn tất crawl tất cả công ty trên tất cả các sàn.")


if __name__ == "__main__":
    # log("Chương trình chính bắt đầu.")
    # try:
    #     # Sử dụng Manager để quản lý biến chia sẻ
    #     with Manager() as manager:
    #         manager_dict = manager.dict()
    #         manager_dict['rate_limit_wait_until'] = 0
    #         api_lock = manager.Lock()
    #
    #         connection_pool = dbc.create_connection_pool(pool_size=1)
    #         if not connection_pool:
    #             log("Lỗi khi tạo Connection Pool. Chương trình sẽ thoát.")
    #             sys.exit(1)
    #
    #         crawl_industries_data(connection_pool, manager_dict, api_lock)
    #         crawl_companies_data(connection_pool, manager_dict, api_lock)
    #
    # except Exception as e:
    #     log(f"Chương trình đã bị chấm dứt do lỗi: {e}")
    # finally:
    #     # Loại bỏ dòng code sleep ở đây
    #     log("Crawl hoàn tất, chương trình sẽ kết thúc.")
    #     pass
    finance = Finance(symbol="HPG", source="VCI")
    df = finance.balance_sheet(lang='vi')
    df.to_csv("tmp.csv")