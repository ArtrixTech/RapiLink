import time


class ShortLink:

    def __init__(self, alias, target, ttl=7200):
        self.alias = alias
        self.target = target
        self.ttl = ttl

        self.__start_up_time = time.time()

    def __str__(self):
        return self.alias

    def is_outdated(self, time_stamp):
        if time_stamp - self.__start_up_time > self.ttl:
            return True
        return False
