import datetime
import functools
import os
import sqlite3
import threading
import database
from classTypes import *
from flask import jsonify

HISTORY_FOLDER = r"history"
RECORD_FILE_FORMAT = 'pakal_%d%m%Y_%H%M%S.sqlite'
RECORD_STRING_FORMAT = '%d.%m.%Y %H:%M:%S'
db = database.connect()
print('new data')

INVALID_SITE_ERROR = 'שגיאה בשם אתר: '
INVALID_UNIT_ERROR = 'שגיאה בשם עמדה: '


def _tuple_deep(obj):
    if isinstance(obj, (list, tuple)):
        return tuple(_tuple_deep(item) for item in obj)
    if isinstance(obj, dict):
        new_obj = sorted([(k, v) for k, v in obj.items()])
        return tuple((key, _tuple_deep(value)) for key, value in new_obj)
    return obj


def pakal_cache(func):
    cache_values = {}
    cache_lock = threading.Lock()

    @functools.wraps(func)
    def wrapper(auth, *args, **kwargs):
        permission = database.get_user_permission_name(db, auth['username'])
        key = _tuple_deep((permission, args, kwargs))
        exception = None
        cache_lock.acquire()
        if key not in cache_values:
            try:
                cache_values[key] = func(auth, *args, **kwargs)
            except Exception as e:
                exception = e
        cache_lock.release()
        if exception:
            raise exception
        return cache_values[key]

    def cache_clear():
        cache_values.clear()

    def cache_print():      # for debugging only
        print(cache_values)

    wrapper.cache_clear = cache_clear
    wrapper.cache_print = cache_print
    return wrapper


def create_dependencies():
    # create and init database
    database.init(db)
    # create admin user (if not exist)
    database.create_admin_user(db)
    # create histrory folder (if not exist)
    if not os.path.exists(HISTORY_FOLDER):
        os.makedirs(HISTORY_FOLDER)
    # compare history files and database
    records = os.listdir(HISTORY_FOLDER)
    history_info = [h[0] for h in database.get_pakal_meta(db)]
    for record in records:
        if record not in history_info:
            os.remove(os.path.join(HISTORY_FOLDER, record))
    for history in history_info:
        if history not in records:
            database.remove_pakal_meta(db, history)


def close():
    db.close()


def _response(is_error: bool, message: str, status_code: int, data: Any):
    return jsonify(isError=is_error, message=message, statusCode=status_code, data=data), status_code


def _response_ok(data=None):
    return _response(is_error=False, message="OK", status_code=200, data=data)


def _response_bad_request(data=None):
    return _response(is_error=True, message="Bad Request", status_code=400, data=data)


def _response_auth_error():
    return _response(is_error=True, message='Unauthorized', status_code=401, data=None)


def _response_not_found(data=None):
    return _response(is_error=True, message="Not Found", status_code=404, data=data)


def _response_no_change(data=None):
    return _response(is_error=True, message="No Change", status_code=460, data=data)


def _response_invalid_pakal(errors: List[Tuple[str, any]]):
    return _response(is_error=True, message="Pakal Invalid", status_code=461, data=errors)


def _create_history_timestamp(date_time: Optional[datetime.datetime] = None):
    if not date_time:
        date_time = datetime.datetime.now()
    return date_time.strftime(RECORD_FILE_FORMAT)


@functools.cache
def _read_history_timestamp(timestamp):
    return datetime.datetime.strptime(timestamp, RECORD_FILE_FORMAT)


def _copy_permission(record_db):
    for table in [database.TABLE_PERMISSIONS,
                  database.TABLE_USERS,
                  database.TABLE_PERMISSION_VIEW,
                  database.TABLE_PERMISSION_EDIT]:
        database.reset_full_table(record_db, table, database.get_full_table(db, table))


@pakal_cache
def _get_pakal_data(auth, pakal_database: sqlite3.Connection | str, new_only=False):
    """
    מקבל פקל מבסיס נתונים
    :param auth: פרטי משתמש
    :param pakal_database: בסיס נתונים או שם קובץ (אם זה תיעוד היסטריה!)
    :param new_only: להציג חדש בלבד
    :return:
    """
    is_string = isinstance(pakal_database, str)
    if is_string:
        pakal_database = sqlite3.connect(pakal_database)
        _copy_permission(pakal_database)
    username = None if auth['username'] == database.ADMIN_USERNAME else auth['username']
    if username:
        data = database.get_pakal_by_username(pakal_database, auth['username'], new_only)
    else:
        data = database.get_pakal_as_admin(pakal_database, new_only)
    entries = [{'siteId': entry[0],
                'name': entry[1],
                'netId': entry[2],
                'markId': entry[3],
                'notes': entry[4] if entry[4] else '',
                'hasChanged': bool(entry[5]),
                'canEdit': bool(entry[6])}
               for entry in data]
    marks = [{'id': mark[0],
              'name': mark[1],
              'color': mark[2]}
             for mark in database.get_marks(pakal_database)]
    nets = [{'id': net[0],
             'group': net[1],
             'name': net[2],
             'encryption': bool(net[3]),
             'ok': net[4],
             'frequency': net[5],
             'hasChanged': bool(net[6])}
            for net in database.get_nets(pakal_database)]
    sites = [{'id': site[0],
              'name': site[1]} for site in database.get_sites(pakal_database, username)]
    if is_string:
        pakal_database.close()
    return entries, marks, nets, sites


def get_pakal(body: Dict[str, any], auth):
    entries, marks, nets, sites = _get_pakal_data(auth, db, body['newOnly'])
    return _response_ok({'entries': entries,
                         'marks': marks,
                         'nets': nets,
                         'sites': sites})


def set_pakal(body: Dict[str, any], auth, can_change_marks, can_change_sites, can_change_nets):
    def pakal_changed():
        # reset 'hasChanged' value before compare
        cmp_entries = [{**e, 'hasChanged': None} for e in entries]
        cmp_new_entries = [{**e, 'hasChanged': None} for e in new_entries]
        cmp_nets = [{**n, 'hasChanged': None} for n in nets]
        cmp_new_nets = [{**n, 'hasChanged': None} for n in new_nets]
        # compare pakal
        return cmp_entries != cmp_new_entries or new_marks != marks or new_sites != sites or cmp_nets != cmp_new_nets

    def save_record():
        filename = _create_history_timestamp()
        with open(database.DB_NAME, 'rb') as database_file:
            with open(os.path.join(HISTORY_FOLDER, filename), 'wb+') as new_file:
                new_file.write(database_file.read())
        database.add_pakal_meta(db, filename, auth['username'], len(real_sites), len(entries), len(nets), len(marks))
        _get_pakal_data.cache_clear()

    def update_marks():
        if not can_change_marks:
            return
        # remove marks
        new_mark_ids = {m['id'] for m in new_marks}
        for mark in marks:
            if mark['id'] not in new_mark_ids:
                database.remove_mark(db, mark['id'])
        # add and modify marks
        mark_ids = {m['id'] for m in marks}
        for mark in new_marks:
            if mark['id'] in mark_ids:
                database.edit_mark(db, mark['id'], mark['name'], mark['color'].lower())
            else:
                new_id = database.add_mark(db, mark['name'], mark['color'].lower())
                mark_convert[mark['id']] = new_id

    def update_nets():
        # remove nets
        new_nets_ids = {n['id'] for n in new_nets}
        if can_change_nets:
            for net in nets:
                if net['id'] not in new_nets_ids:
                    database.remove_net(db, net['id'])
        # add and modify nets
        nets_ids = {n['id'] for n in nets}
        for net in new_nets:
            if net['id'] in nets_ids:
                if can_change_nets:
                    database.edit_net(db, net['id'], net['group'], net['name'], net['encryption'], net['ok'],
                                      net['frequency'])
            else:
                new_id = database.add_net(db, net['group'], net['name'], net['encryption'], net['ok'], net['frequency'])
                net_convert[net['id']] = new_id

    def update_sites():
        if not can_change_sites:
            return
        # remove sites
        new_sites_ids = {s['id'] for s in new_sites}
        for site in sites:
            if site['id'] not in new_sites_ids:
                database.remove_site(db, site['id'])

        # add and modify sites
        sites_ids = {s['id'] for s in sites}
        for site in new_sites:
            if site['id'] in sites_ids:
                try:
                    database.edit_site(db, site['id'], site['name'])
                except sqlite3.IntegrityError:
                    errors.append({'error': INVALID_SITE_ERROR, 'value': site['name']})
                    print(f'INVALID_SITE_ERROR! {site["name"]}')
            else:        # check if the site exist
                try:
                    new_id = database.add_site(db, site['name'])
                    site_convert[site['id']] = new_id
                except sqlite3.IntegrityError:
                    errors.append({'error': INVALID_SITE_ERROR, 'value': site['name']})
                    print(f'INVALID_SITE_ERROR! {site["name"]}')

    def update_entries():
        # remove units
        new_units_ids = {}
        for entry in new_entries:
            if entry['siteId'] not in new_units_ids:
                new_units_ids[entry['siteId']] = set()
            new_units_ids[entry['siteId']].add(entry['name'])
        for entry in entries:
            if entry['canEdit']:
                if entry['siteId'] in new_units_ids:
                    if entry['name'] not in new_units_ids[entry['siteId']]:
                        database.remove_unit(db, entry['siteId'], entry['name'])
        # add and modify units
        units_ids = {}
        for entry in entries:
            if entry['siteId'] not in units_ids:
                units_ids[entry['siteId']] = set()
            units_ids[entry['siteId']].add(entry['name'])
        for entry in new_entries:
            if entry['canEdit']:
                r_mark_id = entry['markId'] if entry['markId'] not in mark_convert else mark_convert[entry['markId']]
                r_net_id = entry['netId'] if entry['netId'] not in net_convert else net_convert[entry['netId']]
                r_site_id = entry['siteId'] if entry['siteId'] not in site_convert else site_convert[entry['siteId']]
                if entry['siteId'] in units_ids:                      # if updating existing site
                    if entry['name'] in units_ids[entry['siteId']]:     # if unit exist
                        database.edit_unit(db, r_site_id, r_net_id, r_mark_id, entry['name'], entry['notes'])
                    else:                                               # if new unit
                        if can_change_sites:
                            try:
                                database.add_unit(db, r_site_id, r_net_id, r_mark_id, entry['name'], entry['notes'])
                            except sqlite3.IntegrityError:
                                errors.append({'error': INVALID_UNIT_ERROR, 'value': entry['name']})
                                print(f'INVALID_UNIT_ERROR! {entry["name"]}')
                else:                                                 # if updating new site
                    if can_change_sites:
                        try:
                            database.add_unit(db, r_site_id, r_net_id, r_mark_id, entry['name'], entry['notes'])
                        except sqlite3.IntegrityError:
                            errors.append({'error': INVALID_UNIT_ERROR, 'value': entry['name']})
                            print(f'INVALID_UNIT_ERROR! {entry["name"]}')
    errors = []
    new_entries, new_marks, new_nets, new_sites = body['entries'], body['marks'], body['nets'], body['sites']
    mark_convert = {}
    net_convert = {}
    site_convert = {}

    entries, marks, nets, sites = _get_pakal_data(auth, db)
    real_sites = [s[1] for s in database.get_sites(db)]
    if not pakal_changed():
        return _response_no_change()
    save_record()
    update_marks()
    update_nets()
    update_sites()
    update_entries()
    # send respond
    if errors:
        return _response_invalid_pakal(errors)
    return _response_ok()


def get_history(_body: Dict[str, any]):
    date_time = []
    for record in database.get_pakal_meta(db):
        filename, creator, sites, units, nets, marks = record
        timestamp_datetime = _read_history_timestamp(filename)
        date_time.append({'datetime': timestamp_datetime.strftime(RECORD_STRING_FORMAT),
                          'fileInfo': {'creator': creator, 'sites': sites, 'units': units, 'nets': nets, 'marks': marks}
                          })
    date_time.sort(key=lambda item: datetime.datetime.strptime(item['datetime'], RECORD_STRING_FORMAT))
    return _response_ok(date_time)


def get_record(body: Dict[str, any], auth, record):
    try:
        db_filename = _create_history_timestamp(datetime.datetime.strptime(record, RECORD_STRING_FORMAT))
    except ValueError:
        return _response_not_found({'entries': [], 'marks': [], 'nets': [], 'sites': []})
    records = os.listdir(HISTORY_FOLDER)
    if db_filename not in records:
        return _response_not_found({'entries': [], 'marks': [], 'nets': [], 'sites': []})
    entries, marks, nets, sites = _get_pakal_data(auth, os.path.join(HISTORY_FOLDER, db_filename), body['newOnly'])
    return _response_ok({'entries': entries, 'marks': marks, 'nets': nets, 'sites': sites})


def remove_record(body: Dict[str, any]):
    date_time = body["filename"]
    filename = datetime.datetime.strptime(date_time, RECORD_STRING_FORMAT).strftime(RECORD_FILE_FORMAT)
    records = os.listdir(HISTORY_FOLDER)
    if filename in records:
        os.remove(os.path.join(HISTORY_FOLDER, filename))
        database.remove_pakal_meta(db, filename)
        return _response_ok()
    return _response_not_found({'error': f'could not remove file {filename} - file not exist!'})


def remove_time_range(body: Dict[str, any]):
    current_time = datetime.datetime.now()
    delta_hours = body["timeRange"]
    records = os.listdir(HISTORY_FOLDER)
    for record in records:
        record_time = datetime.datetime.strptime(record, RECORD_FILE_FORMAT)
        if (current_time - record_time).total_seconds() / 3600 > delta_hours:
            os.remove(os.path.join(HISTORY_FOLDER, record))
            database.remove_pakal_meta(db, record)
    # send respond
    return _response_ok()


def get_permissions_info(_body: Dict[str, any]):
    entries = []
    permissions = [{'id': p[0],
                    'name': p[1],
                    'enableChangeMarks': bool(p[2]),
                    'enableChangeSites': bool(p[3]),
                    'enableChangeNets':bool(p[4]),
                    'enableDeleteHistory': bool(p[5])} for p in database.get_permissions(db)]
    for permission in permissions:
        site_view = [site[0] for site in database.get_site_view(db, permission['id'])]
        site_edit = [site[0] for site in database.get_site_edit(db, permission['id'])]
        entry = {**permission, 'siteView': site_view, 'siteEdit': site_edit}
        entries.append(entry)
    sites = [site[1] for site in database.get_sites(db)]
    return _response_ok({'entries': entries, 'sites': sites})


def set_permissions_info(body: List[Dict[str, any]]):
    permissions = body
    permissions = [{**p, 'name': p['name'].strip()} for p in permissions]     # strip names
    # check if names are not empty
    for permission in permissions:
        if not permission['name']:
            return _response_bad_request('שם הרשאה לא חוקי!')

    # check if names are unique
    unique_names = len({p['name'] for p in permissions}) == len(permissions)
    if not unique_names:
        return _response_bad_request('שמות הרשאות צריכים להיות יחודיים!')

    old_permissions_id = [item[0] for item in database.get_permissions(db)]
    permissions_id = [p['id'] for p in permissions]
    for p_id in old_permissions_id:
        if p_id not in permissions_id:
            database.remove_permission(db, p_id)

    for per in permissions:
        if per['id'] == -1:
            database.add_permission(db,
                                    per['name'],
                                    per['enableChangeMarks'],
                                    per['enableChangeSites'],
                                    per['enableChangeNets'],
                                    per['enableDeleteHistory'],
                                    per['siteView'],
                                    per['siteEdit'])
        else:
            database.edit_permission(db,
                                     per['id'],
                                     per['name'],
                                     per['enableChangeMarks'],
                                     per['enableChangeSites'],
                                     per['enableChangeNets'],
                                     per['enableDeleteHistory'],
                                     per['siteView'],
                                     per['siteEdit'])
    _get_pakal_data.cache_clear()
    return _response_ok()


def get_users_info(_body: Dict[str, any]):
    users_info = database.get_users_data(db)
    entries = [{'userId': item[0], 'username': item[1], 'permissionId': item[2],
                'canChange': bool(item[3])} for item in users_info]
    permissions = database.get_permission_names(db)
    permissions = [{'id': item[0], 'name': item[1]} for item in permissions]
    return _response_ok({'entries': entries, 'permissions': permissions})


def set_users_info(body: List[UserProfile]):
    users_info = body
    users_info = [{**u, 'username': u['username'].strip()} for u in users_info]     # strip usernames
    # check if names are not empty
    for user in users_info:
        if not user['username']:
            return _response_bad_request('שם משתמש לא חוקי!')

    # check if names are unique
    unique_names = len({u['username'] for u in users_info}) == len(users_info)
    if not unique_names:
        return _response_bad_request('שמות משתמש צריכים להיות יחודיים!')

    old_users_id = [(item[0], item[3]) for item in database.get_users_data(db)]
    users_id = [p['userId'] for p in users_info]

    # remove users
    for u_id, can_change in old_users_id:
        if u_id not in users_id and can_change:
            database.remove_user(db, u_id)

    # add and edit users
    for user in users_info:
        if user['userId'] == -1:
            database.add_user(db, user['username'], user['permissionId'])
        else:
            database.edit_user(db, user['userId'], user['username'], user['permissionId'])

    # reset cache
    _get_pakal_data.cache_clear()
    return _response_ok()


def reset_user_password(body: Dict[str, any]):
    user_id = body['userId']
    database.set_user_password(db, user_id)
    return _response_ok()


def login(body: Dict[str, any]):
    is_ok = False
    error = ''
    permission_name = ''
    can_change_marks = can_change_sites = can_change_nets = can_delete_history = admin_permission = False

    username, password = body['username'], body['password']
    values = database.get_user_permission(db, username, password)
    if not values:  # if username and password invalid
        error = 'שם משתמש או סיסמה לא נכונים!'
    else:
        can_change_marks, can_change_sites, can_change_nets, can_delete_history, admin_permission = [bool(v) for v in values]
        permission_name = database.get_user_permission_name(db, username)
        permission_name = 'אלוהים' if admin_permission else permission_name[0] if permission_name else '(ללא)'
        is_ok = True
    return _response_ok({'isOk': is_ok,
                         'error': error,
                         'permissionName': permission_name,
                         'adminPermission': admin_permission,
                         'changeMarks': can_change_marks,
                         'changeSites': can_change_sites,
                         'changeNets': can_change_nets,
                         'deleteHistory': can_delete_history
                         })


def set_password(body: Dict[str, any]):
    username = body['username']
    password = body['password']
    user_id = database.get_user_id_by_username(db, username)[0]
    database.set_user_password(db, user_id, password)
    return _response_ok()


def valid_auth(auth, admin_level, change_marks, change_sites, change_nets, delete_history):
    username, password = auth['username'], auth['password']
    values = database.get_user_permission(db, username, password)
    if not values:  # if username and password invalid
        return False, False, False, False, False, False

    can_change_marks, can_change_sites, can_change_nets, can_delete_history, is_admin = [bool(v) for v in values]
    if ((admin_level and not is_admin) or
            (delete_history and not can_delete_history) or
            (change_sites and not can_change_sites) or
            (change_nets and not can_change_nets) or
            (change_marks and not can_change_marks)):
        return False, is_admin, can_change_marks, can_change_sites, can_change_nets, can_delete_history
    return True, is_admin, can_change_marks, can_change_sites, can_change_nets, can_delete_history


def auth_failed():
    print('auth faild')
    return _response_auth_error()
