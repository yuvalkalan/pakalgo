import sqlite3
from .constants import *


def check_bool(column_name):
    return f'{CHECK} ({column_name} IN (0, 1))'


CREATE_USER_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_USERS} (
    id              {TYPE_INT}      {PKEY},
    username        {TYPE_STRING}   {NOT_NULL},
    password        {TYPE_BYTE}     {NOT_NULL},
    permission_id   {TYPE_INT}      {REF} {TABLE_PERMISSIONS}(id) {ON_DELETE} {SET_NULL}
)
"""

CREATE_PERMISSION_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_PERMISSIONS} (
    id              {TYPE_INT}      {PKEY},
    name            {TYPE_STRING},
    change_marks    {TYPE_BOOL}     {NOT_NULL} {check_bool('change_marks')},
    change_sites    {TYPE_BOOL}     {NOT_NULL} {check_bool('change_sites')},
    change_nets     {TYPE_BOOL}     {NOT_NULL} {check_bool('change_nets')},
    delete_history  {TYPE_BOOL}     {NOT_NULL} {check_bool('delete_history')}
)
"""

CREATE_PERMISSION_VIEW_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_PERMISSION_VIEW} (
    id              {TYPE_INT}      {PKEY},
    permission_id   {TYPE_INT}      {NOT_NULL} {REF} {TABLE_PERMISSIONS}(id) {ON_DELETE} {CASCADE},
    site_id         {TYPE_INT}      {NOT_NULL} {REF} {TABLE_SITES}(id) {ON_DELETE} {CASCADE}
)
"""

CREATE_PERMISSION_EDIT_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_PERMISSION_EDIT} (
    id              {TYPE_INT}      {PKEY},
    permission_id   {TYPE_INT}      {NOT_NULL} {REF} {TABLE_PERMISSIONS}(id) {ON_DELETE} {CASCADE},
    site_id         {TYPE_INT}      {NOT_NULL} {REF} {TABLE_SITES}(id) {ON_DELETE} {CASCADE}
)
"""

CREATE_SITE_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_SITES} (
    id              {TYPE_INT}      {PKEY},
    name            {TYPE_STRING}   {NOT_NULL} {UNIQUE}
)
"""

CREATE_UNIT_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_UNITS} (
    id              {TYPE_INT}      {PKEY},
    site_id         {TYPE_INT}      {NOT_NULL}  {REF} {TABLE_SITES}(id) {ON_DELETE} {CASCADE},
    net_id          {TYPE_INT}      {REF}       {TABLE_NETS}(id) {ON_DELETE} {SET_NULL},
    mark_id         {TYPE_INT}      {REF}       {TABLE_MARKS}(id) {ON_DELETE} {SET_NULL},
    name            {TYPE_STRING}   {NOT_NULL},
    notes           {TYPE_STRING} {NOT_NULL} {DEFAULT} '',
    has_changed     {TYPE_BOOL}   {NOT_NULL} {DEFAULT} 1 {check_bool('has_changed')}
)
"""

CREATE_NET_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_NETS} (
    id              {TYPE_INT}      {PKEY},
    net_group       {TYPE_STRING}   {NOT_NULL},
    name            {TYPE_STRING}   {NOT_NULL},
    encryption      {TYPE_BOOL}     {NOT_NULL}  {check_bool('encryption')},
    ok              {TYPE_STRING}   {NOT_NULL},
    frequency       {TYPE_FLOAT}    {NOT_NULL},
    has_changed     {TYPE_BOOL}     {NOT_NULL}  {DEFAULT} 1 {check_bool('has_changed')}
)
"""

CREATE_MARK_TABLE_CMD = f"""
{CREATE_TABLE} {TABLE_MARKS} (
    id		        {TYPE_INT}      {PKEY},
    name	        {TYPE_STRING},
    color	        {TYPE_STRING}   {CHECK} (color {IS_COLOR})
);"""


CREATE_PAKAL_META_TABLE = f"""
{CREATE_TABLE} {TABLE_PAKAL_META}(
    id {TYPE_INT} {PKEY},
    filename {TYPE_INT} {NOT_NULL},
    creator_id {TYPE_INT} {REF} {TABLE_USERS}(id) {ON_DELETE} {SET_NULL},
    sites {TYPE_INT} {NOT_NULL},
    units {TYPE_INT} {NOT_NULL},
    nets {TYPE_INT} {NOT_NULL},
    marks {TYPE_INT} {NOT_NULL}
);"""


def create_tables(db: sqlite3.Connection):
    cursor = db.cursor()
    cursor.execute(CREATE_USER_TABLE_CMD)
    cursor.execute(CREATE_PERMISSION_TABLE_CMD)
    cursor.execute(CREATE_PERMISSION_VIEW_TABLE_CMD)
    cursor.execute(CREATE_PERMISSION_EDIT_TABLE_CMD)
    cursor.execute(CREATE_SITE_TABLE_CMD)
    cursor.execute(CREATE_UNIT_TABLE_CMD)
    cursor.execute(CREATE_NET_TABLE_CMD)
    cursor.execute(CREATE_MARK_TABLE_CMD)
    cursor.execute(CREATE_PAKAL_META_TABLE)
    db.commit()
