from smoke_signal import app
from flask import request, render_template
from smoke_signal.database.models import db, Feed, Entry
import json

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
