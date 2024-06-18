from database.create.constants import *

ADD_USER = f'''INSERT INTO {TABLE_USERS} (username, password, permission_id) VALUES (?, ?, ?)'''
EDIT_USER = f'''UPDATE {TABLE_USERS} SET username=?, permission_id=? WHERE id = ? AND username != ?'''
REMOVE_USER = f'''DELETE FROM {TABLE_USERS} WHERE id=?'''
SET_USER_PASSWORD = f'''UPDATE {TABLE_USERS} SET password=? WHERE id = ? AND username != ?'''
ADD_PERMISSION = f'''INSERT INTO {TABLE_PERMISSIONS}
                     (name, change_marks, change_sites, change_nets, delete_history)
                     VALUES 
                     (:name, :change_marks, :change_sites, :change_nets, :delete_history)'''
EDIT_PERMISSION = f'''UPDATE {TABLE_PERMISSIONS}
                      SET 
                        name=:name, 
                        change_marks=:change_marks, 
                        change_sites=:change_sites, 
                        change_nets=:change_nets, 
                        delete_history=:delete_history
                      WHERE id=:id'''
REMOVE_PERMISSION = f'''DELETE FROM {TABLE_PERMISSIONS} WHERE id=?'''
# ADD_PERMISSION_VIEW = f'''INSERT INTO {TABLE_PERMISSION_VIEW} (permission_id, site_id)
#                           SELECT ? as permission_id, (SELECT id FROM tbl_sites WHERE name=?) as site_id
#                           WHERE NOT EXISTS (
#                             SELECT permission_id as other_permission_id, site_id as other_site_id
#                             FROM {TABLE_PERMISSION_VIEW}
#                             WHERE other_permission_id=permission_id AND other_site_id=site_id
#                           )'''
ADD_PERMISSION_VIEW = f'''INSERT INTO {TABLE_PERMISSION_VIEW} (permission_id, site_id)
                          VALUES (?, (SELECT id FROM tbl_sites WHERE name=?))'''
ADD_PERMISSION_EDIT = f'''INSERT INTO {TABLE_PERMISSION_EDIT} (permission_id, site_id)
                          VALUES (?, (SELECT id FROM tbl_sites WHERE name=?))'''
DELETE_PERMISSION_VIEW = f'''DELETE FROM {TABLE_PERMISSION_VIEW} WHERE permission_id=?'''
DELETE_PERMISSION_EDIT = f'''DELETE FROM {TABLE_PERMISSION_EDIT} WHERE permission_id=?'''
HAVE_USER = f'SELECT username FROM {TABLE_USERS} WHERE username=?'

REMOVE_MARK = f'DELETE FROM {TABLE_MARKS} WHERE id=?'
EDIT_MARK = f'''UPDATE {TABLE_MARKS}
                SET name=:name, color=:color
                WHERE id=:id'''
ADD_MARK = f'INSERT INTO {TABLE_MARKS}(name, color) VALUES (:name, :color)'

REMOVE_NET = f'''DELETE FROM {TABLE_NETS} WHERE id=?'''
EDIT_NET = f'''UPDATE {TABLE_NETS}
               SET net_group=:net_group, name=:name, encryption=:encryption, ok=:ok, frequency=:frequency
               WHERE id=:id'''
ADD_NET = f'''INSERT INTO {TABLE_NETS}
              (net_group, name, encryption, ok, frequency)
              VALUES 
              (:net_group, :name, :encryption, :ok, :frequency)'''

REMOVE_SITE = f'DELETE FROM {TABLE_SITES} WHERE id=?'
EDIT_SITE = f'''UPDATE {TABLE_SITES}
                SET name=:name
                WHERE id=:id'''
ADD_SITE = f'''INSERT INTO {TABLE_SITES}(name) VALUES (:name)'''

REMOVE_UNIT = f'DELETE FROM {TABLE_UNITS} WHERE site_id=:site_id AND name=:name'
EDIT_UNIT = f'''UPDATE {TABLE_UNITS}
                SET net_id=:net_id, mark_id=:mark_id, notes=:notes
                WHERE site_id=:site_id AND name=:name'''
ADD_UNIT = f'''INSERT INTO {TABLE_UNITS}
               (site_id, net_id, mark_id, name, notes) 
               VALUES (:site_id, :net_id, :mark_id, :name, :notes)'''

ADD_PAKAL_META = f"""INSERT INTO {TABLE_PAKAL_META}
                     (filename, creator_id, sites, units, nets, marks)
                     VALUES (:filename,
                             (SELECT id from {TABLE_USERS} WHERE username=:creator LIMIT 1), 
                             :sites,
                             :units, 
                             :nets,
                             :marks)
"""
REMOVE_PAKAL_META = f"""DELETE FROM {TABLE_PAKAL_META} WHERE filename=:filename"""
