from smoke_signal import app
from flask import request, render_template
from smoke_signal.database.models import db, Feed, Entry
from smoke_signal.fetch_feed import read_feed
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
    feed_id = request.args.get('id', 0, type=int)
    feed = db.session.query(Feed).filter(Feed.id == feed_id).one()
    entries = db.session.query(Entry).filter(Entry.feed_id == feed_id).all()
    return json.dumps([e.serialize() for e in entries])

@app.route('/_refresh_entries')
def refresh_entries():
    feed_id = request.args.get('id', 0, type=int)
    feed = db.session.query(Feed).filter(Feed.id == feed_id).one()
    read_feed(feed)
