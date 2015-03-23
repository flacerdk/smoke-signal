import sqlite3
from flask import Flask

DATABASE = "smoke-screen.db"
DEBUG = True
SECRET_KEY = "my_key"
USERNAME = "admin"
PASSWORD = "admin"

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

if __name__ == "__main__":
    app.run()
