# Methods for the REST API go here.

import feedparser
from flask import Response
from werkzeug.exceptions import NotFound
import json
from sqlalchemy.orm.exc import NoResultFound

from smoke_signal.database import helpers


def jsonify(obj):
    if hasattr(obj, "__iter__"):
        js = json.dumps([item.serialize() for item in obj])
    else:
        js = json.dumps(obj.serialize())
    return js


def get_all_feeds():
    feeds = helpers.feed_list()
    if feeds == []:
        response = []
        status_code = 204
    else:
        response = json.dumps(feeds)
        status_code = 200
    return Response(response, status=status_code, mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url)
    js = jsonify(feed)
    location = {"Location": "/feeds/{}".format(feed.serialize()["id"])}
    resp = Response(js, status=200, mimetype="application/json",
                    headers=location)
    return resp


def get_entries(feed_id, **kwargs):
    return jsonify(helpers.query_entries_filtered_by(feed_id=feed_id,
                                                     **kwargs).all())


def refresh_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id)
        entries = helpers.add_entries(feed_id, parse_entries(feed))
        return jsonify(entries)
    except NoResultFound:
        raise NotFound


def parse_entries(feed):
    parsed = feedparser.parse(feed.url)
    entries = [helpers.create_db_entry(e, feed.id) for e in parsed.entries]
    return entries


def toggle_read_status(feed_id, entry_id, read):
    try:
        entry = helpers.toggle_entry_read_status(feed_id, entry_id, read=read)
        return jsonify(entry)
    except NoResultFound:
        raise NotFound
