class Logger:

    def __init__(self, logger_name="un_classified", location=None):
        from config import config
        import os
        if not location:
            location = config.get_log_location()

        self._save_location = location + "\\" + logger_name
        if not os.path.exists(self._save_location):
            os.mkdir(self._save_location)

        self.logger_name = logger_name

    def log4(self, data, type_text):
        import time

        file_name = time.strftime("%y%m%d[%H]", time.localtime())
        text = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + ": [" + type_text + "] " + data + "\n"

        with open(self._save_location + file_name + ".txt", mode="a") as file:
            file.write(text)

    def log2(self, data, error_type=None):
        import time

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

    def log(self, exception):
        import time
        from utils.cut_string import cut_string

        if isinstance(exception, BaseException):

            error_message = str(repr(exception))

            type_text = error_message[0:error_message.find("(\"")]
            prompt_text = cut_string(error_message, "(", ")")

            inner_prompts = []

            have_inner_prompts = False

            try:
                inner = prompt_text.split(",")
                for prompt in inner:
                    if len(prompt) > 0:
                        inner_prompts.append(cut_string(prompt, "\"", "\""))
                        have_inner_prompts = True
            except AttributeError:
                inner_prompts.append("[No more data]")

            file_name = "[" + self.logger_name + "] " + time.strftime("%y%m%d[%H]", time.localtime())
            content_to_write = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + ": [ " + type_text + " ] "

            if have_inner_prompts:
                for prompt in inner_prompts:
                    content_to_write += prompt + " | "
                content_to_write = content_to_write[0:len(content_to_write) - 3]

            with open(self._save_location + file_name + ".txt", mode="a") as file:
                print("[Log-Written] " + content_to_write)
                file.writelines(content_to_write)

        else:
            raise AttributeError("Error Type Not Correct! String and Exception are allowed.", exception)


'''
l = Logger()

try:
    import requests

    requests.get("oasdjio")

except BaseException as e:

    l.log3(e)
'''
