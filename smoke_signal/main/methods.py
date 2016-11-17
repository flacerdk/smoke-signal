# Methods for the REST API go here.

import feedparser
from flask import Response
from werkzeug.exceptions import NotFound, BadRequest
import json
from sqlalchemy.orm.exc import NoResultFound

from smoke_signal.database import helpers


def get_all_feeds():
    response = {}
    response["_links"] = {"self": {"href": "/feeds/"},
                          "find": {"href": "/feeds{?id}",
                                   "templated": True}}
    feeds = helpers.feed_list()
    for feed in feeds:
        feed["_links"] = {"self": {"href": "/feeds/{}".format(feed["id"])}}
    response["_embedded"] = {"feeds": feeds}
    return Response(json.dumps(response), mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url).serialize()
    feed["_links"] = {"self": {"href": "/feeds/{}".format(feed["id"])}}
    return Response(json.dumps(feed), mimetype="application/json")


def get_entries(predicate="all", **kwargs):
    response = {}
    if "feed_id" in kwargs.keys():
        try:
            feed_id = helpers.query_feed_by_id(kwargs["feed_id"]).id
            response["_links"] = {"self":
                                  {"href": "/feeds/{}/{}".format(feed_id,
                                                                 predicate)}}
        except NoResultFound:
            raise NotFound
    else:
        response["_links"] = {"self":
                              {"href": "/feeds/{}".format(predicate)}}
    if predicate == "all":
        query = helpers.query_entries_filtered_by(**kwargs)
    elif predicate == "read":
        query = helpers.query_entries_filtered_by(read=True, **kwargs)
    elif predicate == "unread":
        query = helpers.query_entries_filtered_by(read=False, **kwargs)
    else:
        raise BadRequest
    entries = [e.serialize() for e in query]
    for entry in entries:
        entry["_links"] = {
            "self": {
                "href": "/feeds/{}/{}".format(entry["feed_id"],
                                              entry["id"])
            }
        }
    response["_embedded"] = {"entries": entries}
    return Response(json.dumps(response),
                    mimetype="application/json")


def get_entry(feed_id, entry_id):
    entry = helpers.query_entry_by_id(feed_id, entry_id)
    response = entry.serialize()
    response["_links"] = {
        "self": {"href": "/feeds/{}/{}".format(feed_id, entry_id)}
    }
    return Response(json.dumps(response), mimetype="application/json")


def refresh_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id)
        helpers.add_entries(feed_id, parse_entries(feed))
        return get_entries(predicate="all", feed_id=feed_id)
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
