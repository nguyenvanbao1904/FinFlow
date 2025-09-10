import mysql.connector
from mysql.connector import pooling
from mysql.connector import Error

def create_connection_pool(pool_name="my_pool", pool_size=10, **db_config):
    """
    Tạo một connection pool.
    Args:
        pool_name (str): Tên của pool.
        pool_size (int): Kích thước của pool.
        db_config (dict): Các tham số cấu hình kết nối database.
    Returns:
        ConnectionPool: Đối tượng connection pool.
    """
    if not db_config:
        db_config = {
            'host': '127.0.0.1',
            'user': 'root',
            'password': '12345678',
            'database': 'fin_flow',
            'port': 3307
        }
    try:
        pool = pooling.MySQLConnectionPool(
            pool_name=pool_name,
            pool_size=pool_size,
            pool_reset_session=True,
            **db_config
        )
        return pool
    except Error as e:
        print(f"Error while connecting to MySQL using Connection Pool: {e}")
        return None

def get_connection_from_pool(pool):
    """Lấy một kết nối từ pool."""
    if pool is None:
        return None
    try:
        connection = pool.get_connection()
        return connection
    except Error as e:
        print(f"Error getting connection from pool: {e}")
        return None

def execute_read_query(connection, query, params=None):
    """Thực thi truy vấn đọc dữ liệu."""
    result = None
    cursor = connection.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        result = cursor.fetchall()
    except Error as e:
        print(f"Error: '{e}'")
    finally:
        cursor.close()
    return result

def execute_many(connection, query, data):
    """Thực thi nhiều truy vấn insert/update cùng lúc."""
    cursor = connection.cursor()
    try:
        cursor.executemany(query, data)
        connection.commit()
        print(f"Đã thực thi {cursor.rowcount} dòng thành công!")
    except Error as e:
        connection.rollback()
        print(f"Lỗi: '{e}'")
    finally:
        cursor.close()