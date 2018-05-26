from flask import Blueprint
from flask import render_template
from flask import request
import json
import requests

front_blueprint = Blueprint('front', __name__, template_folder="templates", static_folder="static")


@front_blueprint.route('/old')
def hello():
    print(front_blueprint.root_path)
    return render_template('old/main.html')


@front_blueprint.route('/')
def main():
    print(front_blueprint.root_path)
    return render_template('main.html')


@front_blueprint.route('/get')
def get_request():
    url, params = request.args.get("url"), request.args.get("params")

    if "api.rapi.link" in url:
        params_json = json.loads(params)
        print("[Ajax-get]" + url)
        print("[Ajax-get]" + params)

        try:
            response = requests.get(url, params=params_json, timeout=5).text

        except requests.ReadTimeout:
            response = "TIMEOUT"

        return response
    return False


@front_blueprint.route('/<alias>')
def url_visit(alias):
    print("==========Visit:" + alias + "=============")

    try:
        response = requests.get("http://api.rapi.link/get_url", params={"alias": alias}, timeout=5).text
        print("[url_visit]" + alias + " -> " + response)

        if not response == "URL_NOT_EXIST":
            print(response)
            response_page = render_template('jump.html', target=response)
        else:
            response_page = render_template('error_code/404.html')
        print("[url_visit]OK")

    except requests.ReadTimeout:
        response_page = render_template('error_code/503.html')

    return response_page
