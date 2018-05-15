from enum import Enum


class Permission(Enum):
    CommonUser = "CommonUser"
    VipUser = "VipUser"
    UnregisteredUser = "UnregisteredUser"

    Administrator = "Administrator"
