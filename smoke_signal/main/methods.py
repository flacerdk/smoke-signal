# Methods for the REST API go here.

import feedparser
from flask import Response, g
import json
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import NotFound, BadRequest, Unauthorized
from werkzeug.security import check_password_hash

from smoke_signal.database import helpers
from smoke_signal.database.models import User


def halify_entry_list(entry_list, feed=None, predicate="all"):
    if feed is None:
        entries = {}
        entries["_links"] = {"self":
                             {"href": "/feeds/{}".format(predicate)}}
    else:
        entries = feed
        entries["_links"] = {"self":
                             {"href": "/feeds/{}/{}".format(feed["id"],
                                                            predicate)}}
    entries["_embedded"] = {"entries": entry_list}
    return entries


def get_all_feeds():
    response = {}
    response["_links"] = {"self": {"href": "/feeds/"},
                          "find": {"href": "/feeds{?id}",
                                   "templated": True}}
    response["_embedded"] = {"feeds": helpers.feed_list()}
    return Response(json.dumps(response), mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url)
    headers = {"location": feed["_links"]["self"]["href"]}
    return Response(json.dumps(feed), mimetype="application/json",
                    headers=headers)


def get_entries(predicate="all", **kwargs):
    if "feed_id" in kwargs.keys():
        try:
            feed = helpers.query_feed_by_id(kwargs["feed_id"])
        except NoResultFound:
            raise NotFound
    else:
        feed = None
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
    entry_list = [e.serialize() for e in query]
    entries = halify_entry_list(entry_list, feed=feed,
                                predicate=predicate)
    return Response(json.dumps(entries),
                    mimetype="application/json")


def get_entry(feed_id, entry_id):
    entry = helpers.query_entry_by_id(feed_id, entry_id)
    response = entry.serialize()
    return Response(json.dumps(response), mimetype="application/json")


def refresh_all_feeds():
    feeds = helpers.feed_list()
    for feed in feeds:
        helpers.add_entries(feed["id"], parse_entries(feed))
    return get_all_feeds()


def refresh_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id)
        helpers.add_entries(feed_id, parse_entries(feed))
        return get_entries(predicate="all", feed_id=feed_id)
    except NoResultFound:
        raise NotFound


def parse_entries(feed):
    parsed = feedparser.parse(feed["url"])
    entries = [helpers.create_db_entry(e, feed["id"]) for e in parsed.entries]
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


def try_login(name, password):
    try:
        user = g.db.query(User).filter(User.name == name).one()
        if check_password_hash(user.password, password):
            return user
        raise Unauthorized
    except NoResultFound:
        raise Unauthorized
