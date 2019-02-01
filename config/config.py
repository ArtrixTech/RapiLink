LOG_LOCATION_WIN = "logs\\"
LOG_LOCATION_LINUX = "logs/"

DOMAIN = "test.rapi.link"
USE_HTTPS = False


def get_log_location():
    from utils import platform
    if platform.is_linux():
        return LOG_LOCATION_LINUX
    else:
        return LOG_LOCATION_WIN
