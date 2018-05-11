from flask import Flask, request
from flask import Blueprint
from flask import render_template
import requests

back_blueprint = Blueprint('back', __name__, subdomain="api")

all_urls = {"a": "2"}


@back_blueprint.route('/get_name')
def get_name():
    return "OK"


@back_blueprint.route('/name_available')
def name_available():
    name = request.args.get("name")
    if name in all_urls:
        return "URL_EXIST"
    return "OK"


@back_blueprint.route('/add_url')
def add_url():
    url_name, target = request.args.get("url_name"), request.args.get("target_url")
    if url_name in all_urls:
        return "URL_EXIST"
    else:
        target = str(target)
        if "http://" and "https://" and "ftp://" not in target:
            target = "http://" + target
        all_urls[url_name] = target
        print(all_urls[url_name])
        return "OK"


@back_blueprint.route('/get_url')
def get_url():
    url_name = request.args.get("url_name")
    print("Get:UrlName=" + url_name)
    if url_name in all_urls:
        return all_urls[url_name]
    else:
        return "URL_NOT_EXIST"
