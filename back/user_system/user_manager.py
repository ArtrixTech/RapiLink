from back.user_system.classes.permissions import Permission
from back.user_system.classes.user import User


class UserManager:

    def __init__(self):
        self.all_users = []

    def __iter__(self):
        self.iter_index = 0
        return self

    def __next__(self):

        if self.iter_index >= len(self.all_users):
            raise StopIteration()
        self.iter_index += 1

        return self.all_users[self.iter_index - 1]

    def kill_by_username(self, username):
        assert isinstance(username, str)
        for obj in self.all_users:
            if username == obj.username:
                self.all_users.pop(self.all_users.index(obj))
                return "OK"
        return "NOT_EXIST"

    def is_exist_by_username(self, username):

        """
        - Judge if the User object inside the pool by its username
        :param username: str-object, the username of target User object
        :return: [0](Boolean)isExist
        """

        assert isinstance(username, str)
        for obj in self.all_users:
            if obj.username == username:
                return True
        return False

    def get_by_username(self, username):
        # Todo: Edit docstring
        """
        - Get the ShortLink object by its alias
        :param username: str-object, the alias of target ShortLink object
        :username: [0](ShortLink)found ShortLink object, [1](str)Status code
        """

        assert isinstance(username, str)
        for obj in self.all_users:
            if username == obj.username:
                return obj, "OK"
        return None, "NOT_EXIST"

    def add(self, user_object):
        # Todo: Edit docstring
        """
        - To add a ShortLink object to the pool
        :param user_object: An object which is in the type of "ShortLink"
        :return: [0](str)Status code, "OK" -> Ok, "ALIAS_EXIST" -> Error:The alias is exist in the pool
        """

        if isinstance(user_object, User):

            if self.is_exist_by_username(user_object.username):
                obj = self.get_by_username(user_object.username)[0]
                assert isinstance(obj, User)
                if obj:
                    assert isinstance(obj, User)
                    print("    [UserPool]Add=" + user_object.username)
                    self.all_users.append(user_object)
                    return "OK"
            else:
                print("    [UserPool]Add=" + user_object.username)
                self.all_users.append(user_object)
                return "OK"

        else:
            raise TypeError("Input Is Not A User Object!")
