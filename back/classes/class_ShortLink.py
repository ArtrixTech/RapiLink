import time
from util.iif import iif


class ShortLink:

    def __init__(self, alias, target, ttl=7200):
        self.alias = alias
        self.target = target
        self.ttl = ttl

        self.__start_up_time = time.time()

    def __str__(self):
        return self.alias

    def time_remain(self):
        remain = self.ttl - (time.time() - self.__start_up_time)

        return iif(remain > 0, remain, 0)

    def is_outdated(self, time_stamp):
        if time_stamp - self.__start_up_time > self.ttl:
            return True
        return False


class ShortLinkPool:

    def __init__(self):
        self.all_urls = []

    def __iter__(self):
        self.iter_index = 0
        return self

    def __next__(self):

        if self.iter_index >= len(self.all_urls):
            raise StopIteration()
        self.iter_index += 1

        return self.all_urls[self.iter_index - 1]

    def clear_outdated(self):
        for obj in self.all_urls:
            if obj.is_outdated(time.time()):
                self.kill_by_alias(obj.alias)

    def kill_by_alias(self, alias):
        assert isinstance(alias, str)
        for obj in self.all_urls:
            if alias == obj.alias:
                self.all_urls.pop(self.all_urls.index(obj))
                return "OK"
        return "NOT_EXIST"

    def is_exist_by_alias(self, alias):

        """
        - Judge if the ShortLink object inside the pool by its alias
        :param alias: str-object, the alias of target ShortLink object
        :return: [0](Boolean)isExist
        """

        assert isinstance(alias, str)
        for obj in self.all_urls:
            if obj.alias == alias:
                return True
        return False

    def get_by_alias(self, alias):

        """
        - Get the ShortLink object by its alias
        :param alias: str-object, the alias of target ShortLink object
        :return: [0](ShortLink)found ShortLink object, [1](str)Status code
        """

        assert isinstance(alias, str)
        for obj in self.all_urls:
            if alias == obj.alias:
                return obj, "OK"
        return None, "NOT_EXIST"

    def add(self, short_link_obj):

        """
        - To add a ShortLink object to the pool
        :param short_link_obj: An object which is in the type of "ShortLink"
        :return: [0](str)Status code, "OK" -> Ok, "ALIAS_EXIST" -> Error:The alias is exist in the pool
        """

        if isinstance(short_link_obj, ShortLink):

            if self.is_exist_by_alias(short_link_obj.alias):
                obj = self.get_by_alias(short_link_obj.alias)[0]
                assert isinstance(obj, ShortLink)
                if obj:
                    assert isinstance(obj, ShortLink)
                    if not obj.is_outdated(time.time()):
                        return "ALIAS_EXIST"
                    else:
                        print("    [Pool]Add=" + short_link_obj.alias)
                        self.all_urls.append(short_link_obj)
                        return "OK"
            else:
                print("    [Pool]Add=" + short_link_obj.alias)
                self.all_urls.append(short_link_obj)
                return "OK"

        else:
            raise TypeError("Input Is Not A ShortLink Object!")
