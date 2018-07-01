from flask import Blueprint
from flask import render_template
from flask import request, url_for, make_response
import json
import requests

mobile_blueprint = Blueprint('mobile', __name__, template_folder="templates", static_folder="static", subdomain="m")


@mobile_blueprint.route('/')
def main():
    img = request.args.get("img")
    if img == "" or not img:
        img = url_for('mobile.static', filename="img/backgrounds/4.jpg")
    elif "http" not in img:
        img = url_for('mobile.static', filename='img/backgrounds/' + str(img) + ".jpg")

    response = make_response(render_template('main_m.html', img_url=img))
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Pragma"] = "no-cache"
    return response


@mobile_blueprint.route('/get')
def get_request():
    url, params = request.args.get("url"), request.args.get("params")

    if "api.rapi.link" in url:
        params_json = json.loads(params)
        print("[Ajax-get]" + url)

        if len(params.replace("\"", "")) > 1:
            print("[Ajax-get]" + params)

        try:
            response = requests.get(url, params=params_json, timeout=5).text

        except requests.ReadTimeout:
            response = "TIMEOUT"

        return response
    return False
