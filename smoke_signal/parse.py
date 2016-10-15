import feedparser
from smoke_signal.database.models import Entry, Feed


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


def parse_feed(url):
    parsed = feedparser.parse(url).feed
    if parsed == {}:
        raise ValueError
    else:
        title = parsed.get('title', 'No title')
        return Feed(title, url)
