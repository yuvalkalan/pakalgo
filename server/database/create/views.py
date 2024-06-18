import sqlite3

from .constants import *


CREATE_VIEW_PAKAL = f"""
{CREATE_VIEW} {VIEW_PAKAL} AS
SELECT 
    s.id AS site_id,
    s.name AS site_name,
    u.name AS unit_name,
    n.id AS net_id,
    n.has_changed = 1 OR u.has_changed = 1 AS has_changed,
    u.mark_id,
    u.notes
FROM {TABLE_UNITS} u
LEFT JOIN {TABLE_NETS} n ON u.net_id = n.id
INNER JOIN {TABLE_SITES} s ON u.site_id = s.id
ORDER BY site_name ASC, unit_name ASC
"""

# filter: WHERE u.has_changed = TRUE OR n.has_changed = TRUE

CREATE_VIEW_PERMISSION_VIEW = f"""
{CREATE_VIEW} {VIEW_PERMISSION_VIEW} AS
SELECT 
    p.id AS id, 
    s.name AS site_name
FROM {TABLE_PERMISSION_VIEW} v
INNER JOIN {TABLE_PERMISSIONS} p ON v.permission_id = p.id
INNER JOIN {TABLE_SITES} s ON v.site_id = s.id
"""


CREATE_VIEW_PERMISSION_EDIT = f"""
{CREATE_VIEW} {VIEW_PERMISSION_EDIT} AS
SELECT 
    p.id AS id, 
    s.name AS site_name
FROM {TABLE_PERMISSION_EDIT} e
INNER JOIN {TABLE_PERMISSIONS} p ON e.permission_id = p.id
INNER JOIN {TABLE_SITES} s ON e.site_id = s.id
"""


def create_views(db: sqlite3.Connection):
    cursor = db.cursor()
    cursor.execute(CREATE_VIEW_PAKAL)
    cursor.execute(CREATE_VIEW_PERMISSION_VIEW)
    cursor.execute(CREATE_VIEW_PERMISSION_EDIT)
    db.commit()
