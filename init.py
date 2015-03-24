from flask import Flask, g, render_template, request
import sqlite3
from contextlib import closing
import os
import json

DATABASE = "./db/smoke-screen.db"
DEBUG = True
SECRET_KEY = "my_key"
USERNAME = "admin"
PASSWORD = "admin"

basedir = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(basedir, DATABASE)

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE_PATH'])

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('db/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/')
def show_feeds():
    cur = g.db.execute('select id, title from feeds order by id')
    feeds = [dict(id=row[0], title=row[1]) for row in cur.fetchall()]
    return render_template('show_feeds.html', feeds=feeds)

@app.route('/_show_entries')
def show_entries():
    feed = request.args.get('id', 0, type=int)
    cur = g.db.execute('select title, text from entries where feed_id = ?', [feed])
    entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
    return json.dumps(entries)

if __name__ == "__main__":
    app.run()
