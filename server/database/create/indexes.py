from .constants import *
import sqlite3

CREATE_UNITS_INDEX = f'{CREATE_UNIQUE_INDEX} unit_unique ON {TABLE_UNITS} (site_id, name);'


def create_indexes(db: sqlite3.Connection):
    cursor = db.cursor()
    cursor.execute(CREATE_UNITS_INDEX)
    db.commit()
