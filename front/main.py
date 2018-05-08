from flask import Flask
from flask import Blueprint
from flask import render_template
import requests

front_blueprint = Blueprint('front', __name__, template_folder="templates", static_folder="static")


@front_blueprint.route('/')
def hello():
    print(front_blueprint.root_path)
    return render_template('main.html')


@front_blueprint.route('/<url_name>')
def url_visit(url_name):
    print("==========" + url_name + "=============")

    try:
        response = requests.get("http://api.rapi.link/get_url?url_name=" + url_name, timeout=5).text
        response_page = requests.get(response).text
    except requests.ReadTimeout:
        return "TIMEOUT"

    return response_page
