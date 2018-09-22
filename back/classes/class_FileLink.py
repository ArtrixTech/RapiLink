import time
from utils.iif import iif
from back import file_process


class FileLink:

    def __init__(self, alias, batch_id, ttl=7200):
        self.alias = alias
        self.batch_id = batch_id
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

    def commit_suicide(self):
        file_process.kill_dir_by_batch_id(self.batch_id)


class FileLinkPool:

    def __init__(self):
        self.all_files = []

    def __iter__(self):
        self.iter_index = 0
        return self

    def __next__(self):

        if self.iter_index >= len(self.all_files):
            raise StopIteration()
        self.iter_index += 1

        return self.all_files[self.iter_index - 1]

    def clear_outdated(self):
        for obj in self.all_files:
            assert isinstance(obj, FileLink)
            if obj.is_outdated(time.time()):
                self.kill(obj)

    def kill(self, obj):
        assert isinstance(obj, FileLink)
        obj.commit_suicide()
        self.all_files.pop(self.all_files.index(obj))

    def kill_by_alias(self, alias):
        assert isinstance(alias, str)
        for obj in self.all_files:
            if alias == obj.alias:
                obj.commit_suicide()
                self.all_files.pop(self.all_files.index(obj))
                return "OK"
        return "NOT_EXIST"

    def is_exist_by_alias(self, alias):

        """
        - Judge if the ShortLink object inside the pool by its alias
        :param alias: str-object, the alias of target ShortLink object
        :return: [0](Boolean)isExist
        """

        assert isinstance(alias, str)
        for obj in self.all_files:
            if obj.alias == alias:
                return True
        return False

    def get_file_obj_by_alias(self, alias):

        """
        - Get the ShortLink object by its alias
        :param alias: str-object, the alias of target ShortLink object
        :return: [0](ShortLink)found ShortLink object, [1](str)Status code
        """

        assert isinstance(alias, str)
        for obj in self.all_files:
            if alias == obj.alias:
                return obj, "OK"
        return None, "NOT_EXIST"

    def get_file_obj_by_batch_id(self, batch_id):

        """
        - Get the ShortLink object by its alias
        :param batch_id: str-object, the alias of target ShortLink object
        :return: [0](ShortLink)found ShortLink object, [1](str)Status code
        """

        assert isinstance(batch_id, str)
        for obj in self.all_files:
            if batch_id == obj.batch_id:
                return obj, "OK"
        return None, "NOT_EXIST"

    def get_batch_id_by_alias(self, alias):
        assert isinstance(alias, str)
        for obj in self.all_files:
            if alias == obj.alias:
                return obj.batch_id, "OK"
        return None, "NOT_EXIST"

    def get_alias_by_batch_id(self, batch_id):
        assert isinstance(batch_id, str)
        for obj in self.all_files:
            if batch_id == obj.batch_id:
                return obj.alias, "OK"
        return None, "NOT_EXIST"

    def add(self, file_link_obj):

        """
        - To add a ShortLink object to the pool
        :param file_link_obj: An object which is in the type of "ShortLink"
        :return: [0](str)Status code, "OK" -> Ok, "ALIAS_EXIST" -> Error:The alias is exist in the pool
        """

        if isinstance(file_link_obj, FileLink):

            if self.is_exist_by_alias(file_link_obj.alias):
                obj = self.get_file_obj_by_alias(file_link_obj.alias)[0]
                assert isinstance(obj, FileLink)
                if obj:
                    assert isinstance(obj, FileLink)
                    if not obj.is_outdated(time.time()):
                        return "ALIAS_EXIST"
                    else:
                        print("    [FilePool]Add=" + file_link_obj.alias)
                        self.all_files.append(file_link_obj)
                        return "OK"
            else:
                print("    [FilePool]Add=" + file_link_obj.alias)
                self.all_files.append(file_link_obj)
                return "OK"

        else:
            raise TypeError("Input Is Not A FileLink Object!")
