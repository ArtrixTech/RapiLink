import requests
import random
from io import BytesIO
from flask import send_file
from PIL import Image

from bing_image.bing_image_class import BingImage

all_image = {}
all_thumbs_pil = {}


def get_bing_img(full_url):
    assert isinstance(full_url, str)
    if "1920x1080" in full_url:
        full_url = full_url.replace("1920x1080", "640x480")

    if full_url in all_image:
        img = all_image[full_url]
    else:
        img = requests.get(full_url).content
        all_image[full_url] = img

    img_io = BytesIO(img)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', cache_timeout=0)


def get_bing_img_small(full_url):
    # Let the server load the low-resolution picture only
    assert isinstance(full_url, str)
    if "1920x1080" in full_url:
        full_url = full_url.replace("1920x1080", "640x480")

    if full_url in all_thumbs_pil:

        img_pil = all_thumbs_pil[full_url]

        temp_io = BytesIO()
        img_pil.save(temp_io, format="PNG")
        temp_io.seek(0)

        return send_file(temp_io, mimetype='image/png', cache_timeout=0)

    else:
        img = requests.get(full_url).content
        all_image[full_url] = img

    img_io = BytesIO(img)
    img_pil = Image.open(img_io)

    img_pil.thumbnail((64, 64), Image.ANTIALIAS)
    all_thumbs_pil[full_url] = img_pil

    save_img_io = BytesIO()
    img_pil.save(save_img_io, format="PNG")

    save_img_io.seek(0)

    return send_file(save_img_io, mimetype='image/png', cache_timeout=0)


all_image_meta = []


def get_bing_url():
    # prevent failure when the image is refreshing
    result = all_image_meta[random.randint(0, len(all_image_meta) - 1)].url
    return result
