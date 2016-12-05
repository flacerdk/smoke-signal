# Methods for the REST API go here.

import feedparser
from flask import Response
import json
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import NotFound, BadRequest

from server.database import helpers
from server.database.models import Entry
from server.import_opml import create_db_from_opml


def halify_entry_list(entry_list, total, feed=None, next_page=None,
                      predicate="all"):
    if feed is None:
        entries = {}
        href = "/api/entry/{}".format(predicate)
    else:
        entries = feed
        href = "/api/feed/{}/{}".format(feed["id"], predicate)
    entries["total"] = total
    entries["_links"] = {"self":
                         {"href": href}}
    if next_page is not None:
        entries["_links"]["next"] = {"href": "{}?page={}".format(
            href,
            next_page)}
    entries["_embedded"] = {"entries": entry_list}
    return entries


def get_all_feeds():
    response = {}
    response["_links"] = {"self": {"href": "/feeds/"},
                          "find": {"href": "/feeds{?id}",
                                   "templated": True}}
    feeds = [feed.serialize() for feed in helpers.query_all_feeds().all()]
    response["_embedded"] = {"feeds": feeds}
    return Response(json.dumps(response), mimetype="application/json")


def post_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise NotFound
    title = parsed.get("title", "No title")
    feed = helpers.add_feed(title, url).serialize()
    headers = {"location": feed["_links"]["self"]["href"]}
    return Response(json.dumps(feed), mimetype="application/json",
                    headers=headers)


def get_entries(predicate="all", page=1, **kwargs):
    if "feed_id" in kwargs.keys():
        try:
            feed = helpers.query_feed_by_id(kwargs["feed_id"]).serialize()
        except NoResultFound:
            raise NotFound
    else:
        feed = None
    if predicate == "all":
        pass
    elif predicate == "read":
        kwargs["read"] = True
    elif predicate == "unread":
        kwargs["read"] = False
    elif predicate == "marked":
        kwargs["marked"] = True
    else:
        raise BadRequest
    query, total, last = helpers.query_entries_paged(page, **kwargs)
    next_page = None
    if not last:
        next_page = page + 1
    entry_list = [e.serialize() for e in query]
    entries = halify_entry_list(entry_list, total, feed=feed,
                                next_page=next_page,
                                predicate=predicate)
    return Response(json.dumps(entries),
                    mimetype="application/json")


def get_entry(entry_id):
    entry = helpers.query_entry_by_id(entry_id)
    feed = helpers.query_feed_by_id(entry.feed_id).serialize()
    feed["_embedded"] = {"entry": entry.serialize()}
    return Response(json.dumps(feed), mimetype="application/json")


def refresh_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id).serialize()
        new_feed = feedparser.parse(feed["url"])
        entries = [parse_entry(feed_id, e) for e in new_feed.entries]
        helpers.add_entries(feed_id, entries)
        feed = helpers.query_feed_by_id(feed_id).serialize()
        return Response(json.dumps(feed),
                        mimetype="application/json")
    except NoResultFound:
        raise NotFound


def delete_feed(feed_id):
    try:
        feed = helpers.query_feed_by_id(feed_id)
    except NoResultFound:
        raise NotFound
    helpers.delete_feed(feed)
    return get_all_feeds()


def parse_entry(feed_id, feed_entry):
    title = feed_entry.get("title", "No title")
    guid = feed_entry.get("id", "No ID")
    summary = feed_entry.get("summary", title)
    link = feed_entry.get("link", "/page_not_found.html")
    pub_date = feed_entry.get("published_parsed", None)
    entry = Entry(title, guid, link, summary, feed_id, pub_date=pub_date)
    return entry


def toggle_status(entry_id, data):
    if "read" not in data and "marked" not in data:
        raise BadRequest
    data = {p: data[p] for p in ["read", "marked"] if p in data}
    try:
        entry = helpers.query_entry_by_id(entry_id)
        feed_id = entry.feed_id
        helpers.update_entry_status(feed_id, entry_id,
                                    data)
        return get_entry(entry_id)
    except NoResultFound:
        raise NotFound


# TODO: should have a better response here
def mark_all_read():
    helpers.update_all_entries({"read": True})
    return Response(json.dumps({"read": True}), mimetype="application/json")


def import_opml(f):
    if f.mimetype != "text/x-opml+xml":
        print(f.mimetype)
        raise BadRequest
    create_db_from_opml(f)
    return get_all_feeds()
