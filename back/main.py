from flask import Flask, request
from flask import Blueprint
from flask import render_template
import requests
from back.classes.class_ShortLink import ShortLink, ShortLinkPool

back_blueprint = Blueprint('back', __name__, subdomain="api")

all_urls = ShortLinkPool()


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
        return "URL_EXIST"
    else:
        target = str(target)
        if not "http://" and not "https://" and "ftp://" not in target:
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
