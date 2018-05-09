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
        print("[Got URL]=" + response)

        if not response == "URL_NOT_EXIST":
            print(response)
            response_page = render_template('jump.html', target=response)
        else:
            response_page = render_template('error_code/404.html')
        print("[Load URL]OK")

    except requests.ReadTimeout:
        response_page = render_template('error_code/503.html')

    return response_page
