# Miscellaneous functions to interact with the database and parse fetched
# feeds. In the future, these will likely be split into different files.

import feedparser
from smoke_signal.database.models import Entry, Feed
from werkzeug.exceptions import NotFound
from flask import g, Response
import json


def feed_list():
    feeds = g.db.query(Feed).all()
    if feeds == []:
        resp = []
        status_code = 204
    else:
        resp = jsonify(feeds)
        status_code = 200
    return Response(resp, status=status_code, mimetype='application/json')


def get_feed(feed_id):
    feed = g.db.query(Feed).filter_by(id=feed_id).first()
    if feed:
        return feed
    else:
        raise NotFound


def get_entries(**kwargs):
    entries = g.db.query(Entry).filter_by(**kwargs).all()
    return jsonify(entries)


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
    js = jsonify(feed)
    location = {'Location': '/feeds/{}'.format(feed.serialize()['id'])}
    resp = Response(js, status=200, mimetype='application/json',
                    headers=location)
    return resp


def refresh_feed(feed_id):
    feed = get_feed(feed_id)
    for e in parse_entries(feed):
        guid = e.guid
        query = g.db.query(Entry).filter_by(guid=guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()
    return get_entries(feed_id=feed.id)


def jsonify(obj):
    if hasattr(obj, '__iter__'):
        js = json.dumps([item.serialize() for item in obj])
    else:
        js = json.dumps(obj.serialize())
    return js


def mark_entry_as_read(feed_id, entry_id):
    query = g.db.query(Entry).filter_by(id=entry_id, feed_id=feed_id)
    if len(query.all()) == 1:
        query.update({Entry.read: True})
        g.db.commit()
        return jsonify(query.one())
    else:
        raise NotFound
