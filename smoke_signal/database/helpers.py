# Miscellaneous functions to interact with the database.

from smoke_signal.database.models import Entry, Feed
from flask import g


def feed_list():
    query = g.db.query(Feed)
    return [feed.serialize() for feed in query.all()]


def add_feed(title, url):
    feed = Feed(title, url)
    g.db.add(feed)
    g.db.commit()
    return query_feed_by_id(feed.id)


def add_entries(feed_id, entries):
    for e in entries:
        guid = e.guid
        query = query_entries_filtered_by(guid=guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()
    return query_entries_filtered_by(feed_id=feed_id).all()


def query_feed_by_id(feed_id):
    return g.db.query(Feed).filter_by(id=feed_id).one().serialize()


def query_entry_by_id(feed_id, entry_id):
    return g.db.query(Entry).filter_by(id=entry_id, feed_id=feed_id).one()


def query_entries_filtered_by(**kwargs):
    return g.db.query(Entry).filter_by(**kwargs)


def create_db_entry(feed_entry, feed_id):
    title = feed_entry.get("title", "No title")
    guid = feed_entry.get("id", "No ID")
    summary = feed_entry.get("summary", title)
    link = feed_entry.get("link", "/page_not_found.html")
    pub_date = feed_entry.get("published_parsed", None)
    entry = Entry(title, guid, link, summary, feed_id, pub_date=pub_date)
    return entry


def update_entry_status(feed_id, entry_id, data):
    query = query_entries_filtered_by(id=entry_id, feed_id=feed_id)
    query.update(data)
    g.db.commit()
    return query.one()
