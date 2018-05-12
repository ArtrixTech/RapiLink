from back.main import all_urls
from back.classes.class_ShortLink import ShortLink
import time

check_interval = 2


def check():
    out = ""
    all_urls.clear_outdated()
    for obj in all_urls:
        assert isinstance(obj, ShortLink)
        out += obj.alias
        out += " -> "
        # out += obj.target
        out += str(int(obj.time_remain())) + "s"
        out += " | "

    if len(out):
        print(out)
    else:
        print("<No Object>")
