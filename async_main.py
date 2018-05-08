from gevent import monkey
from gevent.pywsgi import WSGIServer

from geventwebsocket.handler import WebSocketHandler

from flask import Flask
import project_blueprints

monkey.patch_all()

app = project_blueprints.bind_blueprints(Flask(__name__, static_folder="", static_url_path=None))
app.config.update({
    'SERVER_NAME': 'rapi.link',
    'DEBUG':'True'
})

# app.run(host="45.76.102.168", port=80)

print(app.url_map)

http_server = WSGIServer(('127.0.0.1', 80), app, handler_class=WebSocketHandler)
http_server.serve_forever()
