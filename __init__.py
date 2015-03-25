from flask import Flask, g, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
from database.models import db, Feed, Entry
from contextlib import closing
import os
import json

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

@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()

@app.route('/')
def show_feeds():
    feeds = db.session.query(Feed)
    return render_template('show_feeds.html', feeds=feeds)

@app.route('/_show_entries')
def show_entries():
    feed = request.args.get('id', 0, type=int)
    entries = db.session.query(Entry).filter(Entry.feed_id == feed).all()
    return json.dumps([e.serialize() for e in entries])

if __name__ == "__main__":
    app.run()
