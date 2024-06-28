import hashlib
import threading
from typing import *
import sqlite3

P = ParamSpec('P')
R = TypeVar('R')
DECORATOR_FUNCTION_TYPE = Callable[Concatenate[sqlite3.Cursor, P], R]
DECORATOR_WRAP_TYPE = Callable[Concatenate[sqlite3.Connection, P], R]


def _bytes_to_hex_string(byte_array):
    return ''.join(['{:02x}'.format(byte) for byte in byte_array])


def hash_password(password):
    return _bytes_to_hex_string(hashlib.sha256(password.encode()).digest())


ADMIN_USERNAME = 'אדמין'
ADMIN_PASSWORD = 'huckvnkl'
ADMIN_PASSWORD_HASHED = hash_password(ADMIN_PASSWORD)

db_lock = threading.Lock()


def decorator_logic(func: Callable, db: sqlite3.Connection, *args, **kwargs):
    exception = None
    result = None
    db_lock.acquire()
    try:
        result = func(db.cursor(), *args, **kwargs)
    except Exception as e:
        exception = e
    db_lock.release()

    if exception:
        raise exception
    return result
