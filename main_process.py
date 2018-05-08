from flask import Flask
import project_blueprints

app = project_blueprints.bind_blueprints(Flask(__name__, static_folder="", static_url_path=None))
app.config.update({
    'SERVER_NAME': 'rapi.link'
})

# app.run(host="45.76.102.168", port=80)

print(app.url_map)

app.run(host="127.0.0.1", port=80, debug=True)
