from back.user_system.classes.permissions import Permission
from back.user_system.classes.behaviors import Behaviors, Behavior


class User:

    def __init__(self, username, permission):

        self.permission = Permission.USER_COMMON
        self.username = "NONE"
        if isinstance(permission, Permission):
            self.permission = permission
            self.username = username
            self.__inited = True
        else:
            self.__inited = False
            raise TypeError("Argument \"permission\" is not from the Permission class")

    def judge_behavior(self, behavior):
        if isinstance(behavior, Behavior):
            print(behavior)
