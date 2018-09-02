class Logger:

    def __init__(self, location=None):
        from config import config
        import os
        if not location:
            location = config.get_log_location()

        self._save_location = location
        if not os.path.exists(self._save_location):
            os.mkdir(self._save_location)

    def log(self, data, type_text):
        import time

        file_name = time.strftime("%y%m%d[%H]", time.localtime())
        text = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + ": [" + type_text + "] " + data + "\n"

        with open(self._save_location + file_name + ".txt", mode="a") as file:
            file.write(text)

    def log2(self, data, error_type=None):
        import time, path

        if isinstance(data, BaseException):

            if error_type and isinstance(error_type, str):
                type_text = error_type
            else:
                type_text = data.args

            content = data
            print(type_text + " | " + content)

        elif isinstance(data, str):
            type_text = str(data)
        else:
            raise AttributeError("Error Type Not Correct! String and Exception are allowed.", data)

        file_name = time.strftime("%y%m%d[%H]", time.localtime())
        text = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + ": [" + type_text + "] " + data + "\n"

        with open(self._save_location + file_name + ".txt", mode="a") as file:
            print(1)
            file.write(text)
