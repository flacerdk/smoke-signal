import feedparser
from smoke_signal.database.models import Entry, Feed
from werkzeug.exceptions import NotFound
from flask import g, Response
import json


def feed_list():
    return g.db.query(Feed).all()


def get_feed(feed_id):
    feed = g.db.query(Feed).filter_by(id=feed_id).first()
    if feed:
        return feed
    else:
        raise NotFound


def get_feed_entries(feed_id):
    feed = get_feed(feed_id)
    entries = g.db.query(Entry).filter_by(feed_id=feed.id).all()
    return entries


def parse_entries(feed):
    parsed = feedparser.parse(feed.url)
    entries = [create_db_entry(e, feed.id) for e in parsed.entries]
    return entries


def create_db_entry(feed_entry, feed_id):
    title = feed_entry.get('title', 'No title')
    guid = feed_entry.get('id', 'No ID')
    summary = feed_entry.get('summary', title)
    link = feed_entry.get('link', '/page_not_found.html')
    entry = Entry(title, guid, link, summary, feed_id)
    return entry


def add_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get('title', 'No title')
    feed = Feed(title, url)
    g.db.add(feed)
    g.db.commit()
    return feed


def refresh_feed(feed_id):
    feed = get_feed(feed_id)
    for e in parse_entries(feed):
        guid = e.guid
        query = g.db.query(Entry).filter_by(guid=guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()
    updated_entries = get_feed_entries(feed.id)
    return updated_entries


def jsonify(obj):
    status_code = 200
    if hasattr(obj, '__iter__'):
        if obj == []:
            status_code = 204
        js = json.dumps([item.serialize() for item in obj])
    else:
        js = json.dumps(obj.serialize())
    resp = Response(js, status=status_code, mimetype='application/json')
    return resp
