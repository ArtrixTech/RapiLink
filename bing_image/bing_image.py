import requests
import random
from io import BytesIO
from flask import send_file
from PIL import Image

from utils.cut_string import cut_string

all_image = {}


def get_bing_img(full_url):
    if full_url in all_image:
        img = all_image[full_url]
    else:
        img = requests.get(full_url).content
        all_image[full_url] = img

    img_io = BytesIO(img)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', cache_timeout=0)


def get_bing_img_small(full_url):
    if full_url in all_image:
        img = all_image[full_url]
    else:
        img = requests.get(full_url).content
        all_image[full_url] = img

    img_io = BytesIO(img)
    img_pil = Image.open(img_io)
    # print(img_pil.thumbnail)
    img_pil.thumbnail((128, 128), Image.ANTIALIAS)

    save_img_io = BytesIO()
    img_pil.save(save_img_io, format="PNG")

    # print(img_pil.width)

    save_img_io.seek(0)
    return send_file(save_img_io, mimetype='image/png', cache_timeout=0)


def get_bing_url():
    request_url = "https://cn.bing.com/HPImageArchive.aspx?idx=%index%&n=1"
    request_url = request_url.replace("%index%", str(random.randint(-1, 8)))

    xml = requests.get(request_url).text

    result = cut_string(xml, "<urlBase>", "</urlBase>")
    full_url = "https://cn.bing.com" + result + "_1920x1080.jpg"

    return full_url
