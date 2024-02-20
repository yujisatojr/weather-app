from flask import Flask

app = Flask(__name__, static_folder='client/build', static_url_path='')

from flask_server.routes import *

if __name__ == "__main__":
    app.run(debug=False)