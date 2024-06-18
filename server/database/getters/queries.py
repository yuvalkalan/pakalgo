from database.create.constants import *

# GET_PAKAL_BY_USERNAME = f"""
# SELECT
#     pakal.site_name,
#     pakal.unit_name,
#     pakal.net_group,
#     pakal.net_name,
#     pakal.encryption,
#     pakal.ok,
#     pakal.frequency,
#     pakal.has_changed,
#     pakal.mark_id,
#     m.name AS mark_name,
#     m.color AS mark_color,
#     pakal.notes,
#     v.can_edit
# FROM {VIEW_PAKAL} pakal
# JOIN {TABLE_SITES} sites on sites.name = pakal.site_name
# JOIN
#     (SELECT permission_id, site_id, FALSE AS can_edit
#         FROM {TABLE_PERMISSION_VIEW}
#     UNION
#     SELECT permission_id, site_id, TRUE AS can_edit
#         FROM {TABLE_PERMISSION_EDIT})
#     v on sites.id = v.site_id
# JOIN {TABLE_PERMISSIONS} p on v.permission_id = p.id
# JOIN {TABLE_USERS} u on p.id = u.permission_id
# LEFT JOIN tbl_marks m on pakal.mark_id = m.id
# WHERE u.username = ?
# """

GET_PAKAL_BY_USERNAME = f'''
SELECT 
    pakal.site_id,
    pakal.unit_name,
    pakal.net_id,
    pakal.mark_id,
    pakal.notes,
    pakal.has_changed,
    v.can_edit
FROM {VIEW_PAKAL} pakal
JOIN {TABLE_SITES} sites on sites.name = pakal.site_name
JOIN
    (SELECT permission_id, site_id, FALSE AS can_edit
        FROM {TABLE_PERMISSION_VIEW}
    UNION
    SELECT permission_id, site_id, TRUE AS can_edit
        FROM {TABLE_PERMISSION_EDIT})
    v on sites.id = v.site_id
JOIN {TABLE_PERMISSIONS} p on v.permission_id = p.id
JOIN {TABLE_USERS} u on p.id = u.permission_id
WHERE u.username = ?
'''

GET_PAKAL_AS_ADMIN = f'''
SELECT 
    site_id,
    unit_name,
    net_id,
    mark_id,
    notes,
    has_changed,
    TRUE as can_edit
FROM {VIEW_PAKAL}
'''

GET_FILTERD_PAKAL_AS_ADMIN = f'{GET_PAKAL_AS_ADMIN} WHERE has_changed=1'
GET_FILTERD_PAKAL_BY_USERNAME = f'{GET_PAKAL_BY_USERNAME} AND pakal.has_changed=1'

GET_USERS_INFO = f'''SELECT id as user_id, username, permission_id, username!=? as can_change FROM {TABLE_USERS}'''
GET_PERMISSIONS = f'''SELECT id,
                             name, 
                             change_marks, 
                             change_sites, 
                             change_nets, 
                             delete_history 
                      FROM {TABLE_PERMISSIONS}'''
GET_SITE_VIEW = f'''SELECT site_name FROM {VIEW_PERMISSION_VIEW} WHERE id=?'''
GET_SITE_EDIT = f'''SELECT site_name FROM {VIEW_PERMISSION_EDIT} WHERE id=?'''
GET_SITES = f'''SELECT id, name FROM {TABLE_SITES}'''
GET_SITES_BY_USERNAME = f'''
SELECT DISTINCT sites.id, sites.name FROM {TABLE_SITES} sites
JOIN {VIEW_PAKAL} pakal on sites.name = pakal.site_name
JOIN
    (SELECT permission_id, site_id, FALSE AS can_edit
        FROM {TABLE_PERMISSION_VIEW}
    UNION
    SELECT permission_id, site_id, TRUE AS can_edit
        FROM {TABLE_PERMISSION_EDIT})
    v on sites.id = v.site_id
JOIN {TABLE_PERMISSIONS} p on v.permission_id = p.id
JOIN {TABLE_USERS} u on p.id = u.permission_id
WHERE u.username = ?
'''

GET_PERMISSIONS_NAME = f'''SELECT id, name FROM {TABLE_PERMISSIONS}'''
GET_USERS_LOGIN_INFO = f'''SELECT username, password FROM {TABLE_USERS}'''
GET_USERS_PERMISSION_NAME = f'''SELECT p.name FROM {TABLE_PERMISSIONS} p
                                JOIN {TABLE_USERS} u ON u.permission_id = p.id
                                WHERE u.username = ?'''

GET_USER_ID_BY_NAME = f'''SELECT id FROM {TABLE_USERS} WHERE username=?'''

GET_USER_PERMISSION = f'''SELECT COALESCE(p.change_marks, 0) OR u.username=:admin_username as change_marks,
                                 COALESCE(p.change_sites, 0) OR u.username=:admin_username as change_sites,
                                 COALESCE(p.change_nets, 0) OR u.username=:admin_username as change_nets,
                                 COALESCE(p.delete_history, 0) OR u.username=:admin_username as delete_history,
                                 u.username=:admin_username as isAdmin
                          FROM {TABLE_USERS} u
                          LEFT JOIN {TABLE_PERMISSIONS} p
                          on u.permission_id = p.id
                          WHERE u.username=:username AND u.password=:password'''

GET_MARKS = f'''SELECT id, name, color
                FROM {TABLE_MARKS}'''

GET_NETS = f'''SELECT id, net_group, name, encryption, ok, frequency, has_changed
               FROM {TABLE_NETS}'''

GET_PAKAL_META = f'''SELECT P.filename, u.username as creator, p.sites, p.units, p.nets, p.marks 
                     FROM {TABLE_PAKAL_META} p
                     LEFT JOIN {TABLE_USERS} u on u.id = p.creator_id'''
