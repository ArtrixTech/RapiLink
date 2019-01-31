from config import config


def get_real_location(protocol, sub_domain, location):
    return protocol + "://" + sub_domain + "." + config.DOMAIN + location
