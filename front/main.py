from flask import Blueprint
from flask import render_template
from flask import request, url_for, send_from_directory, make_response
import json
import requests

from back.main import is_alias_exist, alias_type, all_files
from back import file_process

front_blueprint = Blueprint('front', __name__, template_folder="templates", static_folder="static")


@front_blueprint.route('/old')
def hello():
    print(front_blueprint.root_path)
    return render_template('old/main.html')


@front_blueprint.route('/')
def main():
    img = request.args.get("img")
    if img == "" or not img:
        img = url_for('front.static', filename="img/backgrounds/4.jpg")
    elif "http" not in img:
        img = url_for('front.static', filename='img/backgrounds/' + str(img) + ".jpg")

    return render_template('main.html', img_url=img)


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
    print("==========Outer Visit:" + alias + "=============")

    if is_alias_exist(alias):
        type = alias_type(alias)
        if type == "URL":
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
        elif type == "FILE":
            print("[type]File")
            import os

            batch_id = all_files.get_by_alias(alias)[0].batch_id
            root = file_process.get_location_by_batch_id(batch_id)
            print(root)
            for rt, dirs, files in os.walk(root):
                for file in files:
                    response = make_response(
                        send_from_directory(root, file, as_attachment=True, attachment_filename=file))
                    response.headers["Content-Disposition"] = "attachment; filename={}".format(
                        file.encode().decode('latin-1'))
                    return response

            return "None"
    else:
        return make_response("400")
