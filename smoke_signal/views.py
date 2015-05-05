from smoke_signal import app
from flask import request, render_template, redirect, url_for, jsonify
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

@app.route('/feeds/<feed_id>')
def show_entries(feed_id):
    # feed_id is non-negative iff feed could be fetched
    if feed_id >= 0:
        feeds = db.session.query(Feed)
        feed = feeds.filter(Feed.id == feed_id).one()
        entries = db.session.query(Entry).filter(Entry.feed_id == feed_id).all()
    else:
        feeds = []
        entries = []
    return render_template('show_feeds.html', feed=feed, feeds=feeds, entries=entries)

@app.route('/_refresh_entries')
def refresh_entries():
    feeds = db.session.query(Feed)
    feed_id = request.args.get('feedId', -1, type=int)
    if feed_id == -1:
        return json.dumps({"error": "feed is invalid"})
    feed = feeds.filter(Feed.id == feed_id).one()
    try:
        entries = read_feed(feed)
    except:
        return json.dumps({"error": "couldn't fetch feed"})
    for entry in entries:
        db.session.add(entry)
    db.session.commit()
    return json.dumps([e.serialize() for e in entries])
