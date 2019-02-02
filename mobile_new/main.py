from flask import Blueprint
from flask import request, url_for, make_response

from utils import router_gen
from bing_image.bing_image import get_bing_img_small

import json
import requests
import flask

mobile_new_blueprint = Blueprint('mobile_new', __name__, template_folder="templates", static_folder="static",
                                 subdomain="m")


def render_decorate(path_prefix):
    def decorate(func):
        def dec_func(*args, **kw):
            arg_list = list(args)
            arg_list[0] = path_prefix + str(arg_list[0])
            arg_tuple = tuple(arg_list)
            return func(*arg_tuple, **kw)

        return dec_func

    return decorate


@render_decorate("mobile_new/")
def render_template(template_name_or_list, **context):
    return flask.render_template(template_name_or_list, **context)


@mobile_new_blueprint.route('/')
def main():
    response = make_response(render_template('index.html'))
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Pragma"] = "no-cache"
    return response


@mobile_new_blueprint.route('/bing_img')
def bing_img():
    url = request.args.get("u")
    return get_bing_img_small(url)


@mobile_new_blueprint.route('/get')
def get_request():
    url, params = request.args.get("url"), request.args.get("params")

    params_json = json.loads(params)
    print("[Front-Proxy] " + url)

    if len(params.replace("\"", "")) > 1:
        print("[Front-Proxy] " + params)

    try:
        response = requests.get(router_gen.get_real_location("http", "api", url), params=params_json, timeout=5).text

    except requests.ReadTimeout:
        response = "{'error':'true','exception':'timeout'}"

    print("    Response: " + response)
    return response
