from enum import Enum


class Permission(Enum):
    USER_COMMON = 0
    USER_VIP = 1
    USER_UN_REGISTERED = 2

    ADMINISTRATOR = 3
