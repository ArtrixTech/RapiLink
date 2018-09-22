from flask import Blueprint
from flask import request
from flask import make_response
from flask import send_from_directory, make_response

from back.classes.class_ShortLink import ShortLink, ShortLinkPool
from back.classes.class_FileLink import FileLink, FileLinkPool
from back.user_system.user_manager import UserManager, User, Permission
from back.user_system.classes.behaviors import *
from back.file_process import get_save_location
from back import file_process

from logger.log import Logger
from bing_image.bing_image import get_bing_url
from utils import cut_string

import json

back_blueprint = Blueprint('back', __name__, subdomain="api")

all_urls = ShortLinkPool()
all_files = FileLinkPool()
user_manager = UserManager()

debug_logger = Logger(logger_name="backend_main")


def is_alias_exist(alias):
    if all_urls.is_exist_by_alias(alias):
        return True
    if all_files.is_exist_by_alias(alias):
        return True
    return False


def alias_type(alias):
    if all_urls.is_exist_by_alias(alias):
        return "URL"
    if all_files.is_exist_by_alias(alias):
        return "FILE"
    return False


@back_blueprint.route('/bing_url')
def bing_url():
    return get_bing_url()


@back_blueprint.route('/alias_available')
def alias_available():
    """
    - Is alias available
    @param: alias
    :return: [0](str)Status Code, "OK" -> Ok, "ALIAS_EXIST" -> ERROR:The alias is already in the pool
    """

    alias = request.args.get("alias")
    # print("[alias_available]" + alias)
    if is_alias_exist(alias):
        return "ALIAS_EXIST"
    return "OK"


@back_blueprint.route('/add_url')
def add_url():
    """
    - Add an URL by alias and target
    @param: alias, target
    :return: [0](str)Status code, "OK" -> Ok, "ALIAS_EXIST" -> Error:The alias is exist in the pool,
                                "EMPTY_ALIAS" -> Alias is empty, "EMPTY_TARGET_URL" -> The target url is empty
    """
    alias, target = request.args.get("alias"), request.args.get("target")

    if is_alias_exist(alias):
        return "ALIAS_EXIST"
    else:
        if len(alias) == 0:
            return "EMPTY_ALIAS"
        if len(target) == 0:
            return "EMPTY_TARGET_URL"
        target = str(target)
        if "http://" not in target and "https://" not in target and "ftp://" not in target:
            target = "http://" + target

        # Inner exception values:
        # [0](str)Status code, "OK" -> Ok, "ALIAS_EXIST" -> Error:The alias is exist in the pool
        result = all_urls.add(ShortLink(alias, target, 7200))
        print("[add_url]" + str(all_urls.get_by_alias(alias)[0]) + " -> " + target)
        return result


@back_blueprint.route('/get_url')
def get_url():
    """
    - Get the derive URL which was represented by the alias name
    @param: alias
    :return: [0](str)Status Code, "OK" -> Ok
    """
    alias = request.args.get("alias")
    print("[get_url]" + alias)
    if all_urls.is_exist_by_alias(alias):
        # ShortLinkPool.get_by_alias() will return 2 params: OBJ, Status Code
        return all_urls.get_by_alias(alias)[0].target
    else:
        return "URL_NOT_EXIST"


@back_blueprint.route('/add_user')
def add_user():
    """
    - Add a user to the database with permission
    :return: [0](str)Status Code, "OK" -> Ok
    """
    username = request.args.get("username")
    permission_text = request.args.get("permission")
    permission = Permission.CommonUser

    if permission_text.lower() == "administrator":
        permission = Permission.Administrator

    if permission_text.lower() == "unregistereduser":
        permission = Permission.UnregisteredUser

    if permission_text.lower() == "vipuser":
        permission = Permission.VipUser

    if permission_text.lower() == "commonuser":
        permission = Permission.CommonUser

    print(type(permission))

    user_manager.add(User(username, permission))
    return "OK"


@back_blueprint.route('/get_user_data')
def get_user_message():
    username = request.args.get("username")
    usr = user_manager.get_by_username(username)[0]
    assert isinstance(usr, User)

    ret_message = {"username": usr.username, "permission": str(usr.permission)}
    ret_json = json.dumps(ret_message)
    print(ret_json)

    print(usr.judge_behavior(get_behavior_by_name("AddLink")))

    return ret_json


@back_blueprint.route('/upload', methods=['GET', 'POST', 'OPTIONS'])
def upload():
    if request.method == 'POST':
        print("[FileUpload]Handling POST")
        try:
            file = request.files['file']
            batch_id = request.values.get("batch_id")
            alias = request.values.get("alias")
        except:
            file = None
            alias = None
            batch_id = None

        if not batch_id or not alias or not file:
            resp = make_response("400")
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp

        if len(alias) > 1000:
            resp = "ALIAS_TOO_LONG"
            return resp

        if file:
            resp = "OK"
            params = {"ttl": 7200}

            if alias[0] == "$" and "$RPLNK-" in alias:

                commands = cut_string.cut_string(alias, "$RPLNK-", "$")
                alias = str(alias).replace("$RPLNK-" + commands + "$", "")
                commands = commands.split(",")

                for command in commands:
                    command_name, command_data = command.split(":")

                    if command_name == "TTL":
                        params["ttl"] = int(command_data)

            print("    [FileUpload]Get BatchID:" + batch_id)
            print("    [FileUpload]Get File:" + file.filename)
            print("    [FileUpload]Alias:" + alias)
            print("    [FileUpload]Params:" + str(params))

            if is_alias_exist(alias):
                print("    ##[FileUpload]AliasExist!")
                resp = "ALIAS_EXIST"
            else:

                file.save(get_save_location(file.filename, batch_id))
                f_link_obj = FileLink(alias, batch_id, ttl=params["ttl"])
                all_files.add(f_link_obj)
                print("    [FileUpload]File saved to " + get_save_location(file.filename, batch_id))

        else:
            resp = "BAD"

        resp = make_response(resp)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

    elif request.method == 'OPTIONS':
        print("[FileUpload]Handling OPTIONS")
        resp = make_response()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        # print("    [FileUpload]" + str(resp))
        return resp

    else:
        resp = make_response("503")
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return "NONE"


@back_blueprint.route('/download')
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

    return json.dumps({"error": "batch_id not provided"})


@back_blueprint.route('/file_info')
def file_info():
    import os
    batch_id = request.values.get("batch_id")

    if batch_id:
        try:
            root = file_process.get_file_root(batch_id)
        except NotADirectoryError as e:
            debug_logger.log(e)
            return json.dumps({"error": "batch_id doesn't exist"})

        files = [name for name in os.listdir(root) if os.path.isfile(os.path.join(root, name))]
        files_count = len(files)

        # First file only, prepared for multi files download
        file_name = files[0]
        file_obj = all_files.get_file_obj_by_batch_id(batch_id)[0]
        assert isinstance(file_obj, FileLink)

        time_remain = int(file_obj.time_remain())
        file_size = int(os.path.getsize(root + "\\" + file_name) / 1024)

        return json.dumps(
            {"file_name": file_name, "time_remain": time_remain, "file_size": file_size, "files_count": len(files)})

    return json.dumps({"error": "batch_id not provided"})
