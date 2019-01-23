from flask import Flask
from front.main import front_blueprint, www_jump_blueprint
from front_new.main import front_new_blueprint
from back.main import back_blueprint
from mobile.main import mobile_blueprint

all_blueprints = list()

all_blueprints.append(front_blueprint)
all_blueprints.append(front_new_blueprint)
all_blueprints.append(mobile_blueprint)
all_blueprints.append(back_blueprint)
all_blueprints.append(www_jump_blueprint)


def bind_blueprints(flask_app):
    assert isinstance(flask_app, Flask)

    for blueprint in all_blueprints:
        flask_app.register_blueprint(blueprint)

    return flask_app
