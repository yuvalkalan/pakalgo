import sqlite3

from .constants import *

CREATE_NET_UPDATE_TRIGGER = f"""
{CREATE_TRIGGER} net_changed_trigger BEFORE UPDATE ON {TABLE_NETS}
FOR EACH ROW
BEGIN
    UPDATE {TABLE_NETS} 
    SET	has_changed = CASE 
                        WHEN NEW.net_group != OLD.net_group OR
                             NEW.name != OLD.name OR
                             NEW.encryption != OLD.encryption OR
                             NEW.ok != OLD.ok OR 
                             NEW.frequency != OLD.frequency
                        THEN 1
                        ELSE 0
                      END
    WHERE id = OLD.id;
END;
"""

CREATE_UNIT_UPDATE_TRIGGER = f"""
{CREATE_TRIGGER} unit_change_trigger BEFORE UPDATE ON {TABLE_UNITS}
FOR EACH ROW
BEGIN
    UPDATE {TABLE_UNITS}
    SET has_changed = CASE 
                        WHEN coalesce(NEW.site_id, -1) - coalesce(OLD.site_id, -1) != 0 OR 
                             coalesce(NEW.net_id, -1) - coalesce(OLD.net_id, -1) != 0 OR 
                             coalesce(NEW.mark_id, -1) - coalesce(OLD.mark_id, -1) != 0 OR 
                             NEW.name != OLD.name OR 
                             NEW.notes != OLD.notes
                        THEN 1
                        ELSE 0
                      END
    WHERE id = OLD.id;
END;
"""

CREATE_CHANGE_PERMISSION_TRIGGER = f"""
{CREATE_TRIGGER} change_permissions BEFORE INSERT ON {TABLE_PERMISSION_EDIT}
BEGIN
    DELETE FROM {TABLE_PERMISSION_VIEW} WHERE new.permission_id = permission_id AND new.site_id = site_id;
END;
"""

CREATE_CHECK_VALID_PERMISSION_TRIGGER = f"""
{CREATE_TRIGGER} check_valid_permission
BEFORE INSERT ON {TABLE_PERMISSION_VIEW}
BEGIN
    SELECT RAISE(ABORT, 'can not set view permissions when have edit permissions!')
    FROM {TABLE_PERMISSION_EDIT} WHERE new.permission_id = permission_id AND new.site_id = site_id;
END;
"""


def create_triggers(db: sqlite3.Connection):
    cursor = db.cursor()
    cursor.execute(CREATE_NET_UPDATE_TRIGGER)
    cursor.execute(CREATE_UNIT_UPDATE_TRIGGER)
    cursor.execute(CREATE_CHANGE_PERMISSION_TRIGGER)
    cursor.execute(CREATE_CHECK_VALID_PERMISSION_TRIGGER)
    db.commit()
