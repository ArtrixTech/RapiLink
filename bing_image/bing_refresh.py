import requests
import time
import random

from utils.cut_string import cut_string
from bing_image import bing_image


def upd_bing_links():
    # Bug backup: prevent requests in clearing the list to get blank content

    from logger.log import Logger
    debug_logger = Logger(logger_name="bing_refresh")

    print("[Bing-Image] Start Bing-Image URL Fetching...")
    bing_image.all_image_url = ["https://cn.bing.com/sa/simg/hpb/NorthMale_EN-US8782628354_1920x1080.jpg",
                                "https://cn.bing.com/az/hprichbg/rb/RoyalOntarioMuseum_JA-JP10362892998_1920x1080.jpg"]

    for i in range(-1, 7):

        request_url = "https://cn.bing.com/HPImageArchive.aspx?idx=%index%&n=1"
        request_url = request_url.replace("%index%", str(i))

        try:

            xml = requests.get(request_url).text
            result = cut_string(xml, "<urlBase>", "</urlBase>")

        # Firstly the exception capturing program will trigger this type of exception.
        except requests.exceptions.ConnectionError as e:

            # If ConnectionError happens, retry fetching for once.
            debug_logger.log(e)
            try:
                xml = requests.get(request_url).text
                result = cut_string(xml, "<urlBase>", "</urlBase>")
            except requests.exceptions.ConnectionError as e2:
                debug_logger.log(e2)
                result = "az/hprichbg/rb/RoundBales_JA-JP8640987726"
                print("[Bing-Image] Fetching Bing NO." + str(i - 1) + " Failed due to ConnectionError.")

        except BaseException as e:
            debug_logger.log(e)
            result = "az/hprichbg/rb/RoundBales_JA-JP8640987726"
            print("[Bing-Image] Fetching Bing NO." + str(i - 1) + " Failed due to other error.")

        full_url = "https://cn.bing.com" + result + "_1920x1080.jpg"
        print("    [0" + str(i + 1) + "] " + full_url)
        bing_image.all_image_url.append(full_url)

        # Delay 0.4-2s to prevent Anti-Grabbing Block
        time.sleep(random.randint(4, 20) / 10)

    # Pop the pre-added pictures, ensure the pictures added are the fresh ones.
    bing_image.all_image_url.pop(0)
    bing_image.all_image_url.pop(1)
    print("[Bing-Image] Refreshed. Picture Count: " + str(len(bing_image.all_image_url)))


def flush_bing_img_cache():
    from bing_image import bing_image

    bing_image.all_image = {}
    bing_image.all_thumbs_pil = {}
    print("[Bing-Image] Image Cache Flushed!")
