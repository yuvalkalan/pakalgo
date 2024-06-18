import re

from .tables import *
from .triggers import *
from .views import *
from .indexes import *


def _regexp(expr, item):
    reg = re.compile(expr)
    return reg.search(item) is not None


def connect() -> sqlite3.Connection:
    db = sqlite3.connect(DB_NAME, check_same_thread=False)
    db.cursor().execute(ENFORCE_FOREIGN_KEY)
    db.commit()
    return db


def init(db: sqlite3.Connection):
    db.create_function("REGEXP", 2, _regexp)
    create_tables(db)
    create_triggers(db)
    create_views(db)
    create_indexes(db)


def _create_some_data(db):
    print('creating some data...')
    cursor = db.cursor()
    k = 10
    # יוצר הרשאות
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_PERMISSIONS}(name, change_marks, change_sites, change_nets, delete_history) VALUES (?, ?, ?, ?, ?)',
                       (f'value {i}', True, False, False, True))
    # יוצר יוזרים
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_USERS}(username, password, permission_id) VALUES (?,?,?)', (f'user {i}', f'password {i}'.encode(), i//2 + 1))
    # יוצר רשתות
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_NETS}(net_group, name, encryption, ok, frequency, has_changed) VALUES (?, ?, ?, ?, ?, ?)', (f'group {i % 5}', f'name {i}', i % 2, f'ok {i}', 30+i, 0))
    # יוצר אתרים
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_SITES}(name) VALUES (?)', (f'site {i}', ))
        # יוצר עמדות
        for j in range(k):
            cursor.execute(f'INSERT INTO {TABLE_UNITS}(site_id, net_id, name, has_changed) VALUES (?, ?, ?, ?)', (i+1, j+1, f'unit {i}, {j}', 0))
    # משנה הרשאות עריכה
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_PERMISSION_EDIT}(permission_id, site_id) VALUES (?,?)', (i+1, k-i))
    # משנה הרשאות צפייה
    for i in range(k):
        cursor.execute(f'INSERT INTO {TABLE_PERMISSION_VIEW}(permission_id, site_id) VALUES (?,?)', (i+1, i+1))
    db.commit()


if __name__ == '__main__':
    pass
else:
    _db = connect()
    init(_db)
    if not _db.cursor().execute(f'select * from {TABLE_SITES}').fetchall():
        _create_some_data(_db)
