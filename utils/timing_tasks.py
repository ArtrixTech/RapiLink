from back.main import all_urls, all_files
from back.classes.class_ShortLink import ShortLink
from back.classes.class_FileLink import FileLink
import time
import requests
from utils.cut_string import cut_string
from bing_image import bing_image

check_interval = 2


class TimingTask:

    def __init__(self, do_function, check_delay):
        self.do_function = do_function
        self.check_delay = check_delay
        self.last_update = 0

    def check(self):
        if time.time() - self.last_update > self.check_delay:
            self.do_function()
            self.last_update = time.time()


def upd_bing_links():
    # Bug backup: prevent requests in clearing the list to get blank content
    print("[Bing Image]checkBing...")
    bing_image.all_image_url = ["https://cn.bing.com/az/hprichbg/rb/Liverpool_ZH-CN12418492140_1920x1080.jpg"]

    for i in range(-1, 7):
        request_url = "https://cn.bing.com/HPImageArchive.aspx?idx=%index%&n=1"
        request_url = request_url.replace("%index%", str(i))

        xml = requests.get(request_url).text

        result = cut_string(xml, "<urlBase>", "</urlBase>")
        full_url = "https://cn.bing.com" + result + "_1920x1080.jpg"
        bing_image.all_image_url.append(full_url)

    bing_image.all_image_url.pop(0)
    print("[Bing Image]Refreshed. Now:" + str(len(bing_image.all_image_url)))


def upd_main():
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


timingTask_main = TimingTask(upd_main, 1)
timingTask_bing = TimingTask(upd_bing_links, 3600)


def check():
    timingTask_main.check()
    timingTask_bing.check()
