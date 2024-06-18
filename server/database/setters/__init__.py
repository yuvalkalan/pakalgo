import functools
from .queries import *
from database.constants import *


def _setter_decorator(func: DECORATOR_FUNCTION_TYPE) -> DECORATOR_WRAP_TYPE:

    @functools.wraps(func)
    def wrapper(db: sqlite3.Connection, *args: P.args, **kwargs: P.kwargs) -> R:
        result = decorator_logic(func, db, *args, **kwargs)
        db.commit()
        return result

    return wrapper


@_setter_decorator
def create_admin_user(cursor: sqlite3.Cursor):
    have_user = cursor.execute(HAVE_USER, (ADMIN_USERNAME,)).fetchone()
    if not have_user:
        cursor.execute(ADD_USER, (ADMIN_USERNAME, ADMIN_PASSWORD_HASHED, None))


@_setter_decorator
def add_user(cursor: sqlite3.Cursor, username, permission_id=None):
    cursor.execute(ADD_USER, (username, DEFAULT_PASSWORD_HASHED, permission_id))


@_setter_decorator
def edit_user(cursor: sqlite3.Cursor, user_id, username, permission_id=None):
    cursor.execute(EDIT_USER, (username, permission_id, user_id, ADMIN_USERNAME))


@_setter_decorator
def set_user_password(cursor: sqlite3.Cursor, user_id, new_password=DEFAULT_PASSWORD_HASHED):
    cursor.execute(SET_USER_PASSWORD, (new_password, user_id, ADMIN_USERNAME))


@_setter_decorator
def add_permission(cursor: sqlite3.Cursor,
                   name,
                   change_marks,
                   change_sites,
                   change_nets,
                   delete_history,
                   site_view,
                   site_edit):
    params = {'name': name,
              'change_marks': change_marks,
              'change_sites': change_sites,
              'change_nets': change_nets,
              'delete_history': delete_history}
    new_permission_id = cursor.execute(ADD_PERMISSION, params).lastrowid
    for site in site_view:
        cursor.execute(ADD_PERMISSION_VIEW, (new_permission_id, site))
    for site in site_edit:
        cursor.execute(ADD_PERMISSION_EDIT, (new_permission_id, site))


@_setter_decorator
def edit_permission(cursor: sqlite3.Cursor,
                    permission_id,
                    name,
                    change_marks,
                    change_sites,
                    change_nets,
                    delete_history,
                    site_view,
                    site_edit):
    params = {'name': name,
              'change_marks': change_marks,
              'change_sites': change_sites,
              'change_nets': change_nets,
              'delete_history': delete_history,
              'id': permission_id}
    cursor.execute(EDIT_PERMISSION, params)
    cursor.execute(DELETE_PERMISSION_VIEW, (permission_id, ))
    cursor.execute(DELETE_PERMISSION_EDIT, (permission_id, ))
    for site in site_view:
        cursor.execute(ADD_PERMISSION_VIEW, (permission_id, site))
    for site in site_edit:
        cursor.execute(ADD_PERMISSION_EDIT, (permission_id, site))


@_setter_decorator
def remove_permission(cursor: sqlite3.Cursor, permission_id):
    cursor.execute(REMOVE_PERMISSION, (permission_id, ))


@_setter_decorator
def remove_user(cursor: sqlite3.Cursor, user_id):
    cursor.execute(REMOVE_USER, (user_id, ))


@_setter_decorator
def remove_mark(cursor: sqlite3.Cursor, mark_id):
    cursor.execute(REMOVE_MARK, (mark_id,))


@_setter_decorator
def edit_mark(cursor: sqlite3.Cursor, mark_id, name, color):
    cursor.execute(EDIT_MARK, {'name': name, 'color': color, 'id': mark_id})


@_setter_decorator
def add_mark(cursor: sqlite3.Cursor, name, color):
    rowid = cursor.execute(ADD_MARK, {'name': name, 'color': color}).lastrowid
    return cursor.execute(f'SELECT id FROM {TABLE_MARKS} WHERE ROWID=?', (rowid,)).fetchone()[0]  # get new mark id


@_setter_decorator
def remove_net(cursor: sqlite3.Cursor, net_id):
    cursor.execute(REMOVE_NET, (net_id, ))


@_setter_decorator
def edit_net(cursor: sqlite3.Cursor, net_id, group, name, encryption, ok, frequency):
    cursor.execute(EDIT_NET, {'id': net_id, 'net_group': group, 'name': name,
                              'encryption': encryption, 'ok': ok, 'frequency': frequency})


@_setter_decorator
def add_net(cursor: sqlite3.Cursor, group, name, encryption, ok, frequency):
    rowid = cursor.execute(ADD_NET, {'net_group': group,
                                     'name': name,
                                     'encryption': encryption,
                                     'ok': ok,
                                     'frequency': frequency}).lastrowid
    return cursor.execute(f'SELECT id FROM {TABLE_NETS} WHERE ROWID=?', (rowid, )).fetchone()[0]    # get new net id


@_setter_decorator
def remove_site(cursor: sqlite3.Cursor, site_id):
    cursor.execute(REMOVE_SITE, (site_id, ))


@_setter_decorator
def edit_site(cursor: sqlite3.Cursor, site_id, name):
    cursor.execute(EDIT_SITE, {'id': site_id, 'name': name})


@_setter_decorator
def add_site(cursor: sqlite3.Cursor, name):
    rowid = cursor.execute(ADD_SITE, {'name': name}).lastrowid
    return cursor.execute(f'SELECT id FROM {TABLE_SITES} WHERE ROWID=?', (rowid, )).fetchone()[0]    # get new site id


@_setter_decorator
def remove_unit(cursor: sqlite3.Cursor, site_id, name):
    cursor.execute(REMOVE_UNIT, {'site_id': site_id, 'name': name})


@_setter_decorator
def edit_unit(cursor: sqlite3.Cursor, site_id, net_id, mark_id, name, notes):
    cursor.execute(EDIT_UNIT, {'site_id': site_id, 'net_id': net_id, 'mark_id': mark_id, 'name': name, 'notes': notes})


@_setter_decorator
def add_unit(cursor: sqlite3.Cursor, site_id, net_id, mark_id, name, notes):
    cursor.execute(ADD_UNIT, {'site_id': site_id, 'net_id': net_id, 'mark_id': mark_id, 'name': name, 'notes': notes})


@_setter_decorator
def reset_full_table(cursor: sqlite3.Cursor, table, data):
    cursor.execute(f'DELETE FROM {table}')
    for d in data:
        cursor.execute(f'INSERT INTO {table} VALUES({",".join("?" for _ in d)})', d)


@_setter_decorator
def add_pakal_meta(cursor: sqlite3.Cursor, filename, username, len_sites, len_units, len_nets, len_marks):
    cursor.execute(ADD_PAKAL_META, {'filename': filename,
                                    'creator': username,
                                    'sites': len_sites,
                                    'units': len_units,
                                    'nets': len_nets,
                                    'marks': len_marks})


@_setter_decorator
def remove_pakal_meta(cursor: sqlite3.Cursor, filename):
    cursor.execute(REMOVE_PAKAL_META, {'filename': filename})
