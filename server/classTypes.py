from typing import *


class EntryBodyType(TypedDict):
    hasChanged: bool
    value: str
    markID: int


class EntryHeaderType(TypedDict):
    group: str
    id: int
    netEncryption: str
    netFreq: str
    netName: str
    netOk: str
    hasChanged: bool


class EntryType(TypedDict):
    body: List[EntryBodyType]
    header: EntryHeaderType


class MarkType(TypedDict):
    id: int
    name: str
    color: str


class TableType(TypedDict):
    body: List[EntryType]
    sites: List[str]
    marks: List[MarkType]


class UserProfile(TypedDict):
    permissionId: Optional[int]
    userId: int
    username: str
