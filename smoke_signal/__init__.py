from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from smoke_signal.database.models import db
import os

DATABASE = "database/smoke-signal.db"
DEBUG = True
SECRET_KEY = "my_key"
USERNAME = "admin"
PASSWORD = "admin"

basedir = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(basedir, DATABASE)
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE_PATH

app = Flask(__name__)
app.config.from_object(__name__)
db.init_app(app)

import smoke_signal.views
