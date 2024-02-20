from flask import Flask

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

from routes import *

if __name__ == "__main__":
    app.run(debug=False)