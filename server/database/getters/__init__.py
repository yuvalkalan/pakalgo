import functools
from .queries import *
from database.constants import *


def _getter_decorator(func: DECORATOR_FUNCTION_TYPE) -> DECORATOR_WRAP_TYPE:

    @functools.wraps(func)
    def wrapper(db: sqlite3.Connection, *args: P.args, **kwargs: P.kwargs) -> R:
        return decorator_logic(func, db, *args, **kwargs)

    return wrapper


@_getter_decorator
def get_pakal_by_username(cursor: sqlite3.Cursor, username, new_only):
    cursor.execute(GET_FILTERD_PAKAL_BY_USERNAME if new_only else GET_PAKAL_BY_USERNAME, (username, ))
    return cursor.fetchall()


@_getter_decorator
def get_pakal_as_admin(cursor: sqlite3.Cursor, new_only):

    cursor.execute(GET_FILTERD_PAKAL_AS_ADMIN if new_only else GET_PAKAL_AS_ADMIN)
    return cursor.fetchall()


@_getter_decorator
def get_users_data(cursor: sqlite3.Cursor):
    cursor.execute(GET_USERS_INFO, (ADMIN_USERNAME, ))
    return cursor.fetchall()


@_getter_decorator
def get_permissions(cursor: sqlite3.Cursor):
    cursor.execute(GET_PERMISSIONS)
    return cursor.fetchall()


@_getter_decorator
def get_site_view(cursor: sqlite3.Cursor, permission_id):
    cursor.execute(GET_SITE_VIEW, (permission_id, ))
    return cursor.fetchall()


@_getter_decorator
def get_site_edit(cursor: sqlite3.Cursor, permission_id):
    cursor.execute(GET_SITE_EDIT, (permission_id, ))
    return cursor.fetchall()


@_getter_decorator
def get_sites(cursor: sqlite3.Cursor, username=None):
    if username:
        cursor.execute(GET_SITES_BY_USERNAME, (username, ))
    else:
        cursor.execute(GET_SITES)
    return cursor.fetchall()


@_getter_decorator
def get_num_of_units(cursor: sqlite3.Cursor):
    cursor.execute(GET_NUM_OF_UNITS)
    return cursor.fetchone()[0]


@_getter_decorator
def get_permission_names(cursor: sqlite3.Cursor):
    cursor.execute(GET_PERMISSIONS_NAME)
    return cursor.fetchall()


@_getter_decorator
def get_users_login_info(cursor: sqlite3.Cursor):
    cursor.execute(GET_USERS_LOGIN_INFO)
    return cursor.fetchall()


@_getter_decorator
def get_user_permission_name(cursor: sqlite3.Cursor, username):
    cursor.execute(GET_USERS_PERMISSION_NAME, (username, ))
    return cursor.fetchone()


@_getter_decorator
def get_user_id_by_username(cursor: sqlite3.Cursor, username):
    cursor.execute(GET_USER_ID_BY_NAME, (username, ))
    return cursor.fetchone()


@_getter_decorator
def get_user_permission(cursor: sqlite3.Cursor, username, password):
    params = {'username': username, 'password': password, 'admin_username': ADMIN_USERNAME}
    cursor.execute(GET_USER_PERMISSION, params)
    return cursor.fetchone()


@_getter_decorator
def get_marks(cursor: sqlite3.Cursor):
    cursor.execute(GET_MARKS)
    return cursor.fetchall()


@_getter_decorator
def get_nets(cursor: sqlite3.Cursor):
    cursor.execute(GET_NETS)
    return cursor.fetchall()


@_getter_decorator
def get_full_table(cursor: sqlite3.Cursor, table):
    return cursor.execute(f'SELECT * FROM {table}').fetchall()


@_getter_decorator
def get_pakal_meta(cursor: sqlite3.Cursor):
    return cursor.execute(GET_PAKAL_META).fetchall()
