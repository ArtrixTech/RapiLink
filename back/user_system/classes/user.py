from back.user_system.classes.permissions import Permission
from back.user_system.classes.behaviors import Behaviors, Behavior


class User:
    def __init__(self, username, permission=Permission.UnregisteredUser):

        if isinstance(permission, Permission):
            self.permission = permission
            self.username = username
            self.__inited = True
        else:
            self.__inited = False
            raise TypeError("Argument \"permission\" is not from the Permission class")

    def judge_behavior(self, behavior):
        if isinstance(behavior, Behavior):
            if self.permission == Permission.UnregisteredUser:
                return behavior.UnregisteredUser
            if self.permission == Permission.CommonUser:
                return behavior.CommonUser
            if self.permission == Permission.VipUser:
                return behavior.VipUser
            if self.permission == Permission.Administrator:
                return behavior.Administrator
