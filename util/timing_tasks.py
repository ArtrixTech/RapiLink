from back.main import all_urls, all_files
from back.classes.class_ShortLink import ShortLink
from back.classes.class_FileLink import FileLink
import time

check_interval = 2


def check():
    out_links = "Links:"
    out_files = "Files:"
    all_urls.clear_outdated()
    all_files.clear_outdated()

    for obj in all_urls:
        assert isinstance(obj, ShortLink)
        out_links += obj.alias
        out_links += " -> "
        out_links += str(int(obj.time_remain())) + "s"
        out_links += " | "

    for obj in all_files:
        assert isinstance(obj, FileLink)
        out_files += obj.alias
        out_files += " -> "
        out_files += str(int(obj.time_remain())) + "s"
        out_files += " | "

    if not out_links == "Links:":
        print(out_links)
    if not out_files == "Files:":
        print(out_files)
