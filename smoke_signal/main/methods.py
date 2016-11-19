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
        href = "/feeds/{}".format(feed["id"])
        feed["_links"] = {
            "self": {"href": href},
            "find": {
                "href": "{}{{?id}}".format(href),
                "templated": True
            }
        }
    response["_embedded"] = {"feeds": feeds}
    return Response(json.dumps(response), mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url).serialize()
    href = "/feeds/{}".format(feed["id"])
    feed["_links"] = {
        "self": {"href": href},
        "find": {
            "href": "{}{{?id}}".format(href),
            "templated": True
        }
    }
    headers = {"location": href}
    return Response(json.dumps(feed), mimetype="application/json",
                    headers=headers)


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
    elif predicate == "marked":
        query = helpers.query_entries_filtered_by(marked=True, **kwargs)
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


def toggle_status(feed_id, entry_id, data):
    if "read" not in data and "marked" not in data:
        raise BadRequest
    data = {p: data[p] for p in ["read", "marked"] if p in data}
    try:
        helpers.update_entry_status(feed_id, entry_id,
                                    data)
        return get_entry(feed_id, entry_id)
    except NoResultFound:
        raise NotFound
