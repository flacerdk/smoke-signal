from flask import request, render_template, g, Blueprint
from smoke_signal.database.models import Feed, Entry
from smoke_signal.parse import parse_feed
import json

feed_view = Blueprint("feed_view", __name__,
                      template_folder="templates")


@feed_view.route('/')
def show_feeds():
    feeds = g.db.query(Feed)
    return render_template('show_feeds.html', feeds=feeds)


@feed_view.route('/feeds/<feed_id>')
def show_entries(feed_id):
    # feed_id is non-negative iff feed could be fetched
    if feed_id >= 0:
        feeds = g.db.query(Feed)
        feed = feeds.filter(Feed.id == feed_id).one()
        entries = g.db.query(Entry).filter(Entry.feed_id == feed_id).all()
    else:
        feeds = []
        entries = []
    return render_template('show_feeds.html',
                           feed=feed, feeds=feeds, entries=entries)


@feed_view.route('/refresh/<feed_id>')
def refresh(feed_id):
    feeds = g.db.query(Feed)
    if feed_id == -1:
        return json.dumps({"error": "feed is invalid"})
    feed = feeds.filter(Feed.id == feed_id).one()
    print(feed.__unicode__())
    try:
        entries = parse_feed(feed)
    except:
        return json.dumps({"error": "couldn't fetch feed"})
    add_entries(entries)
    return render_template('show_feeds.html',
                           feed=feed, feeds=feeds, entries=entries)


def add_entries(entries):
    for e in entries:
        guid = e.guid
        query = g.db.query(Entry).filter(Entry.guid == guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()
