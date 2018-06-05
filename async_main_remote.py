from gevent import monkey
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask import Flask
import project_blueprints

from threading import Thread

from utils import timing_tasks
import time

monkey.patch_all()

app = project_blueprints.bind_blueprints(Flask(__name__, static_folder="", static_url_path=None))
app.url_map.default_subdomain = ''
app.config.update({
    'SERVER_NAME': 'rapi.link',
    'DEBUG': 'True'
})
app.debug = True

# app.run(host="45.76.102.168", port=80)

print(app.url_map)

http_server = WSGIServer(('45.76.102.168', 80), app, handler_class=WebSocketHandler)


def start():
    http_server.serve_forever()


tr = Thread(target=start)
tr.start()

while 1:
    timing_tasks.check()
    time.sleep(timing_tasks.check_interval)
