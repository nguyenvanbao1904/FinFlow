import database_connector as dbc
from vnstock import Finance, Listing
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
MAX_WORKERS = 5  # số tiến trình chạy song song

# Global lock for logging
log_lock = Lock()


def log(msg, highlight=False):
    """Prints a log message, with an option to highlight it."""
    prefix = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] "
    if highlight:
        print(f"\n\033[92m{prefix}{msg}\033[0m\n")  # màu xanh lá
    else:
        with log_lock:
            print(f"{prefix}{msg}")


# ----------------- Utilities -----------------
def safe_request(func, *args, **kwargs):
    """
    Handles API requests with rate limiting and retries.
    """
    manager_dict = kwargs.pop('manager_dict')
    api_lock = kwargs.pop('api_lock')
    retries = 0
    while retries < RETRY_MAX:
        with api_lock:
            current_time = time.time()
            time_to_wait = max(0, manager_dict['rate_limit_wait_until'] - current_time)
            if time_to_wait > 0:
                log(f"Đang chờ {time_to_wait:.2f} giây...")
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
                    log(f"Bị giới hạn rate limit, chờ {wait_time_with_buffer} giây...")
                return pd.DataFrame()
            else:
                retries += 1
                wait_time = RETRY_DELAY * (2 ** (retries - 1))
                log(f"Lỗi {err_msg}. Thử lại {retries}/{RETRY_MAX} sau {wait_time} giây...")
                time.sleep(wait_time)

    log(f"Đã thử {RETRY_MAX} lần nhưng thất bại. Bỏ qua request.")
    return pd.DataFrame()


# ----------------- Helper -----------------
def get_or_create_financial_period(connection, year, quarter):
    query = "SELECT id FROM financial_period WHERE year=%s AND quarter=%s"
    result = dbc.execute_read_query(connection, query, (year, quarter))
    if result:
        return result[0][0]
    period_id = str(uuid.uuid4())
    insert_query = "INSERT INTO financial_period (id, year, quarter) VALUES (%s, %s, %s)"
    dbc.execute_many(connection, insert_query, [(period_id, year, quarter)])
    return period_id


def get_assets_type_map(connection):
    query = "SELECT id, name FROM assets_type"
    rows = dbc.execute_read_query(connection, query)
    return {row[1]: row[0] for row in rows}


# ----------------- Crawl Assets -----------------
def crawl_assets_report(symbol, company_id, connection, manager_dict, api_lock):
    assets_map = get_assets_type_map(connection)
    finance = Finance(symbol=symbol, source="VCI")
    df = safe_request(finance.balance_sheet, lang='vi', manager_dict=manager_dict, api_lock=api_lock)

    if df.empty:
        log(f"{symbol}: Không có dữ liệu balance sheet.")
        return

    assets_col_map = {
        "Tiền và tương đương tiền (đồng)": "CASH_AND_CASH_EQUIVALENTS",
        "TỔNG CỘNG TÀI SẢN (đồng)": "TOTAL_ASSETS",
        "Tiền gửi tại ngân hàng nhà nước Việt Nam": "BALANCES_WITH_THE_SBV",
        "Tiền gửi tại các TCTD khác và cho vay các TCTD khác": "INTERBANK_PLACEMENTS_AND_LOANS",
        "Chứng khoán kinh doanh": "TRADING_SECURITIES",
        "Chứng khoán đầu tư": "INVESTMENT_SECURITIES",
        "Cho vay khách hàng": "LOANS_TO_CUSTOMERS",
        "Giá trị thuần đầu tư ngắn hạn (đồng)": "SHORT_TERM_INVESTMENTS",
        "Các khoản phải thu ngắn hạn (đồng)": "SHORT_TERM_RECEIVABLES",
        "Phải thu dài hạn (đồng)": "LONG_TERM_RECEIVABLES",
        "Hàng tồn kho ròng": "INVENTORIES",
        "Tài sản cố định (đồng)": "FIXED_ASSETS",
    }

    assets_batch = []
    for idx, row in df.iterrows():
        try:
            year, quarter = int(row['Năm']), int(row['Kỳ'])
            period_id = get_or_create_financial_period(connection, year, quarter)
        except Exception as e:
            log(f"{symbol}: Lỗi financial period dòng {idx}: {e}")
            continue

        for df_col, enum_name in assets_col_map.items():
            if enum_name not in assets_map:
                continue
            try:
                value = row.get(df_col)
                if pd.isna(value):
                    continue
                assets_batch.append((
                    str(uuid.uuid4()), value, company_id, period_id, assets_map[enum_name]
                ))
            except Exception as e:
                log(f"{symbol}: Lỗi xử lý assets cột {df_col}, dòng {idx}: {e}")

    if assets_batch:
        insert_query = """
            INSERT IGNORE INTO assets_report
            (id, value, company_id, financial_period_id, assets_type_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        dbc.execute_many(connection, insert_query, assets_batch)
        log(f"{symbol}: Insert {len(assets_batch)} dòng assets.")


# ----------------- Worker -----------------
def process_company_assets(symbol, company_id, manager_dict, api_lock):
    connection_pool = dbc.create_connection_pool(pool_size=1)
    connection = connection_pool.get_connection()
    if not connection:
        log(f"{symbol}: Không lấy được connection.")
        return

    try:
        crawl_assets_report(symbol, company_id, connection, manager_dict, api_lock)
    except Exception as e:
        log(f"{symbol}: Lỗi tổng thể {e}")
    finally:
        connection.close()


def crawl_assets_data(connection_pool, manager_dict, api_lock):
    connection = connection_pool.get_connection()
    companies = dbc.execute_read_query(connection, "SELECT id, code FROM company")
    connection.close()

    log(f"Tìm thấy {len(companies)} công ty để crawl assets.")

    with ProcessPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(process_company_assets, symbol, company_id, manager_dict, api_lock): (company_id, symbol)
            for company_id, symbol in companies
        }
        for future in as_completed(futures):
            _, symbol = futures[future]
            try:
                future.result()
            except Exception as e:
                log(f"{symbol}: lỗi tiến trình {e}")

    log("Hoàn tất crawl assets cho tất cả công ty.", highlight=True)


# ----------------- Main -----------------
if __name__ == "__main__":
    try:
        with Manager() as manager:
            manager_dict = manager.dict()
            manager_dict['rate_limit_wait_until'] = 0
            api_lock = manager.Lock()

            connection_pool = dbc.create_connection_pool(pool_size=1)
            if not connection_pool:
                log("Không tạo được connection pool.")
                sys.exit(1)

            crawl_assets_data(connection_pool, manager_dict, api_lock)

    except Exception as e:
        log(f"Lỗi chương trình: {e}")
    finally:
        log("Chương trình kết thúc.")
