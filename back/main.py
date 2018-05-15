from flask import Blueprint
from flask import request

from back.classes.class_ShortLink import ShortLink, ShortLinkPool
from back.user_system.user_manager import UserManager, User, Permission
from back.user_system.classes.behaviors import *

import json

back_blueprint = Blueprint('back', __name__, subdomain="api")

all_urls = ShortLinkPool()
user_manager = UserManager()


@back_blueprint.route('/get_name')
def get_name():
    return "OK"


@back_blueprint.route('/alias_available')
def name_available():
    """
    - Is alias available
    :return: [0](str)Status Code, "OK" -> Ok, "ALIAS_EXIST" -> ERROR:The alias is already in the pool
    """

    name = request.args.get("alias")
    print("[alias_available]" + name)
    if all_urls.is_exist_by_alias(name):
        return "ALIAS_EXIST"
    return "OK"


@back_blueprint.route('/add_url')
def add_url():
    alias, target = request.args.get("alias"), request.args.get("target")

    if all_urls.is_exist_by_alias(alias):
        return "ALIAS_EXIST"
    else:
        if len(alias) == 0:
            return "EMPTY_ALIAS"
        if len(target) == 0:
            return "EMPTY_TARGET_URL"
        target = str(target)
        if "http://" not in target and "https://" not in target and "ftp://" not in target:
            target = "http://" + target

        result = all_urls.add(ShortLink(alias, target, 7200))
        print("[add_url]" + str(all_urls.get_by_alias(alias)[0]) + " -> " + target)
        return result


@back_blueprint.route('/get_url')
def get_url():
    alias = request.args.get("alias")
    print("[get_url]" + alias)
    if all_urls.is_exist_by_alias(alias):
        # ShortLinkPool.get_by_alias() will return 2 params: OBJ, Status Code
        return all_urls.get_by_alias(alias)[0].target
    else:
        return "URL_NOT_EXIST"


@back_blueprint.route('/add_user')
def add_user():
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
