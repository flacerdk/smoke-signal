# Methods for the REST API go here.

import feedparser
from flask import Response
from werkzeug.exceptions import NotFound
import json
from sqlalchemy.orm.exc import NoResultFound

from smoke_signal.database import helpers


def get_all_feeds():
    response = {}
    response["_links"] = {"self": {"href": "/feeds/"},
                          "find": {"href": "/feeds{?id}",
                                   "templated": True}}
    feeds = helpers.feed_list()
    if feeds == []:
        status_code = 204
    else:
        for feed in feeds:
            feed["_links"] = {"self": {"href": "/feeds/{}".format(feed["id"])}}
        response["_embedded"] = {"feeds": feeds}
        status_code = 200
    return Response(json.dumps(response), status=status_code,
                    mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url).serialize()
    feed["_links"] = {"self": {"href": "/feeds/{}".format(feed["id"])}}
    return Response(json.dumps(feed), mimetype="application/json")


def get_entries(feed_id, **kwargs):
    try:
        helpers.query_feed_by_id(feed_id)
    except NoResultFound:
        raise NotFound
    response = {}
    response["_links"] = {"self":
                          {"href": "/feeds/{}/entries".format(feed_id)}}
    query = helpers.query_entries_filtered_by(feed_id=feed_id, **kwargs).all()
    if query == []:
        status_code = 204
    else:
        status_code = 200
        entries = [e.serialize() for e in query]
        for entry in entries:
            entry["_links"] = {
                "self": {
                    "href": "/feeds/{}/entries/{}".format(entry["feed_id"],
                                                          entry["id"])
                }
            }
        response["_embedded"] = {"entries": entries}
    return Response(json.dumps(response), status=status_code,
                    mimetype="application/json")


def get_entry(feed_id, entry_id):
    entry = helpers.query_entry_by_id(feed_id, entry_id)
    response = entry.serialize()
    response["_links"] = {
        "self": {"href": "/feeds/{}/entries/{}".format(feed_id, entry_id)}
    }
    return Response(json.dumps(response), mimetype="application/json")


def refresh_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id)
        helpers.add_entries(feed_id, parse_entries(feed))
        return get_entries(feed_id)
    except NoResultFound:
        raise NotFound


def parse_entries(feed):
    parsed = feedparser.parse(feed.url)
    entries = [helpers.create_db_entry(e, feed.id) for e in parsed.entries]
    return entries


def toggle_read_status(feed_id, entry_id, read):
    try:
        helpers.toggle_entry_read_status(feed_id, entry_id, read=read)
        return get_entry(feed_id, entry_id)
    except NoResultFound:
        raise NotFound
