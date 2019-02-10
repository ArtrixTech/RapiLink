from flask import Blueprint
from flask import request, url_for, send_from_directory, make_response
import json
import requests
import flask

from back.main import is_alias_exist, alias_type, all_files
from back import file_process

from utils import router_gen

from logger.log import Logger

from bing_image.bing_image import get_bing_img_small

front_new_blueprint = Blueprint('front_new', __name__, template_folder="templates", static_folder="static",
                                subdomain="")


def render_decorate(path_prefix):
    def decorate(func):
        def dec_func(*args, **kw):
            arg_list = list(args)
            arg_list[0] = path_prefix + str(arg_list[0])
            arg_tuple = tuple(arg_list)
            return func(*arg_tuple, **kw)

        return dec_func

    return decorate


@render_decorate("front_new/")
def render_template(template_name_or_list, **context):
    return flask.render_template(template_name_or_list, **context)


@front_new_blueprint.route('/bing_img')
def bing_img():
    url = request.args.get("u")
    return get_bing_img_small(url)


@front_new_blueprint.route('/old')
def hello():
    print(front_new_blueprint.root_path)
    return render_template('old/main.html')


@front_new_blueprint.route('/lango')
def lango():
    return render_template('lango_test.html')


@front_new_blueprint.route('/')
def main():
    return render_template('index.html', img_url="")


@front_new_blueprint.route('/get')
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


@front_new_blueprint.route('/straight/<alias>')
def url_visit(alias):
    print("[Url-Visit] " + alias)

    if is_alias_exist(alias):
        visit_type = alias_type(alias)
        if visit_type == "URL":
            try:
                response = requests.get(router_gen.get_real_location("http", "api", "/get_url"),
                                        params={"alias": alias}, timeout=5).text
                print("[url_visit]" + alias + " -> " + response)

                if not response == "URL_NOT_EXIST":
                    print(response)
                    response_page = render_template('link_redirect.html', target=response)
                else:
                    response_page = render_template('error_code/404.html')
                print("[url_visit]OK")

            except requests.ReadTimeout:
                response_page = render_template('error_code/503.html')

            return response_page
        elif visit_type == "FILE":
            print("    Type: File")
            import os

            batch_id = all_files.get_file_obj_by_alias(alias)[0].batch_id
            root = file_process.get_file_root(batch_id)
            print("    Location: " + root)
            for rt, dirs, files in os.walk(root):
                for file in files:
                    response = make_response(
                        send_from_directory(root, file, as_attachment=True, attachment_filename=file))
                    response.headers["Content-Disposition"] = "attachment; filename={}".format(
                        file.encode().decode('latin-1'))
                    return response

            return "None"
    else:
        return render_template('error_code/404.html')


@front_new_blueprint.route('/<alias>')
def url_visit_test(alias):
    print("[Url-Visit] " + alias)

    if is_alias_exist(alias):
        visit_type = alias_type(alias)
        if visit_type == "URL":
            try:
                response = requests.get(router_gen.get_real_location("http", "api", "/get_url"),
                                        params={"alias": alias}, timeout=5).text
                print("[url_visit]" + alias + " -> " + response)

                if not response == "URL_NOT_EXIST":
                    response_page = render_template('link_redirect.html', target=response)
                    print(response_page)
                else:
                    response_page = render_template('error_code/404.html')
                print("[url_visit]OK")

            except requests.ReadTimeout:
                response_page = render_template('error_code/503.html')

            return response_page
        elif visit_type == "FILE":
            print("    Type: File")
            import os

            batch_id = all_files.get_file_obj_by_alias(alias)[0].batch_id
            root = file_process.get_file_root(batch_id)
            print("    Location: " + root)

            return render_template('file_redirect.html', batch_id=batch_id)
    else:
        return render_template('error_code/404.html')


@front_new_blueprint.route('/download')
def download_by_batch_id():
    import os
    batch_id = request.values.get("batch_id")

    if batch_id:
        try:
            root = file_process.get_file_root(batch_id)
        except NotADirectoryError as e:
            debug_logger.log(e)
            return json.dumps({"error": "batch_id doesn't exist"})

        print("[Backend Download] BatchID = " + batch_id)
        for rt, dirs, files in os.walk(root):
            for file in files:
                response = make_response(
                    send_from_directory(root, file, as_attachment=True, attachment_filename=file))
                response.headers["Content-Disposition"] = "attachment; filename={}".format(
                    file.encode().decode('latin-1'))
                return response

    return render_template('error_code/404.html')
    # return json.dumps({"error": "batch_id not provided"})
