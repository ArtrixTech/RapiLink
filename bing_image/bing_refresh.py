import requests
import time
import random

from utils.cut_string import cut_string
from bing_image import bing_image
from bing_image.bing_image_class import BingImage


# Important: Plz install "XML2DICT" from pip first.

def upd_bing_links():
    # Bug backup: prevent requests in clearing the list to get blank content

    from logger.log import Logger
    debug_logger = Logger(logger_name="bing_refresh")

    print("[Bing-Image] Start Bing-Image URL Fetching...")

    from encoder import XML2Dict
    xml = XML2Dict()

    def fetch():

        bing_image.all_image_meta = [
            BingImage("https://cn.bing.com/az/hprichbg/rb/WindmillLighthouse_JA-JP3858962830_1920x1080.jpg",
                      "暂无图片说明", "https://bing.com"),
            BingImage("https://cn.bing.com/az/hprichbg/rb/WinterLynx_ZH-CN7158207296_1920x1080.jpg",
                      "波希米亚摩拉维亚高地的猞猁，捷克 (© sduben/Getty Images Plus)",
                      "https://www.bing.com/search?q=%E7%8C%9E%E7%8C%81&form=hpcapt&mkt=zh-cn")]

        request_url_1 = "https://cn.bing.com/HPImageArchive.aspx?idx=-1&n=9"
        request_url_2 = "https://cn.bing.com/HPImageArchive.aspx?idx=7&n=9"

        result1 = xml.parse(requests.get(request_url_1).text)
        result2 = xml.parse(requests.get(request_url_2).text)

        all_img_json = result1["images"]["image"]
        for item in result2["images"]["image"]:
            all_img_json.append(item)

        index = 0

        for now_img in all_img_json:
            description = str(now_img["copyright"]).replace("b'", "").replace("'", "")
            copyright_link = str(now_img["copyrightlink"]).replace("b'", "").replace("'", "")
            url_base = str(now_img["urlBase"]).replace("b'", "").replace("'", "")
            full_image_url = "https://cn.bing.com" + url_base + "_1920x1080.jpg"

            img = BingImage(full_image_url, description, copyright_link)
            bing_image.all_image_meta.append(img)

            print("    [0" + str(index) + "] " + full_image_url)
            index += 1

        bing_image.all_image_meta.pop(0)
        bing_image.all_image_meta.pop(1)

    try:
        fetch()
    except requests.exceptions.ConnectionError as e:
        try:
            # On error, re-fetch.
            fetch()
        except requests.exceptions.ConnectionError as e2:
            print("[Bing-Image] Fetching BingImage failed due to ConnectionError.")

    print("[Bing-Image] Refreshed. Picture Count: " + str(len(bing_image.all_image_meta)))


def flush_bing_img_cache():
    from bing_image import bing_image

    bing_image.all_image = {}
    bing_image.all_thumbs_pil = {}
    print("[Bing-Image] Image Cache Flushed!")
