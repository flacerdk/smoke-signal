# Miscellaneous functions to interact with the database and parse fetched
# feeds. In the future, these will likely be split into different files.

import feedparser
from smoke_signal.database.models import Entry, Feed
from sqlalchemy import func, cast, Integer
from werkzeug.exceptions import NotFound
from flask import g, Response
import json


# Returns the feed list, along with a count of unread entries.
def feed_list():
    query = g.db.query(Feed.id, Feed.title, Feed.url,
                       func.count(Entry.read) -
                       func.sum(cast(Entry.read, Integer))).\
            join(Feed.entries).\
            group_by(Feed.id).all()
    if query == []:
        resp = []
        status_code = 204
    else:
        feeds = [dict(zip(["id", "title", "url", "unread"], feed))
                 for feed in query]
        resp = json.dumps(feeds)
        status_code = 200
    return Response(resp, status=status_code, mimetype="application/json")


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


# If read=True, force new read status to be True, and likewise for read=False.
def toggle_entry_read_status(feed_id, entry_id, read=None):
    query = g.db.query(Entry).filter_by(id=entry_id, feed_id=feed_id)
    row = query.all()
    if len(row) == 1:
        if read is not None:
            new_read_status = read
        else:
            new_read_status = not row[0].read
        query.update({Entry.read: new_read_status})
        g.db.commit()
        return jsonify(query.one())
    else:
        raise NotFound
