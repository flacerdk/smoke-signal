# Miscellaneous functions to interact with the database.

from server.database.models import Entry, Feed
from flask import g

PAGE_SIZE = 20


def query_all_feeds():
    return g.db.query(Feed).order_by(Feed.title.desc())


def query_feed_by_id(feed_id):
    return g.db.query(Feed).filter_by(id=feed_id).one()


def add_feed(title, url):
    feed = Feed(title, url)
    g.db.add(feed)
    g.db.commit()
    return query_feed_by_id(feed.id)


def delete_feed(feed):
    g.db.delete(feed)
    g.db.commit()


def query_entries_filtered_by(**kwargs):
    return g.db.query(Entry).\
        filter_by(**kwargs).\
        order_by(Entry.pub_date.desc())


def query_entries_paged(page=1, **kwargs):
    if page < 1:
        raise ValueError
    query = query_entries_filtered_by(**kwargs)
    total = query.count()
    query_paged = query.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
    last = total < page*PAGE_SIZE
    return query_paged, total, last


def query_entry_by_id(entry_id):
    return g.db.query(Entry).filter_by(id=entry_id).one()


def add_entries(feed_id, entries):
    for e in entries:
        guid = e.guid
        query = query_entries_filtered_by(guid=guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()
    return query_entries_filtered_by(feed_id=feed_id)


def update_all_entries(data):
    query = g.db.query(Entry)
    query.update(data)
    g.db.commit()


def update_entry_status(feed_id, entry_id, data):
    query = g.db.query(Entry).filter_by(id=entry_id, feed_id=feed_id)
    query.update(data)
    g.db.commit()
    return query.one()
