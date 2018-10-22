from gevent import monkey

monkey.patch_all()

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask import Flask
import project_blueprints

from threading import Thread

from timing_task import timing_task
import time

app = project_blueprints.bind_blueprints(Flask(__name__, static_folder="", static_url_path=None))
app.url_map.default_subdomain = ''
app.config.update({
    'SERVER_NAME': 'rapi.link',
    'DEBUG': 'True'
})
app.debug = True

print(app.url_map)

# Local IP Address
http_server = WSGIServer(('127.0.0.1', 80), app, handler_class=WebSocketHandler)


def start():
    http_server.serve_forever()


tr = Thread(target=start)
tr.start()

while 1:
    timing_task.check()
    time.sleep(timing_task.check_interval)
