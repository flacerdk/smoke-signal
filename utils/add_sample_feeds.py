from smoke_signal import app, init_db
from smoke_signal.database.helpers import add_feed
from utils.generate_feed import SampleFeed

import feedparser
from os import walk, makedirs
import sys

FEEDS_DIR = app.root_path + "/test_resources/feeds/"

app.config['DATABASE_PATH'] = 'sqlite:///smoke_signal/test_resources/posts.db'


def create_sample_feed_files(num_feeds, num_items):
    makedirs(FEEDS_DIR, exist_ok=True)
    for i in range(num_feeds):
        feed = SampleFeed("Test feed {}".format(i))
        for j in range(num_items):
            feed.add_item()
        filename = FEEDS_DIR + "feed{}.xml".format(i)
        with open(filename, "w+") as f:
            f.write(feed.__str__())


def add_feeds_to_db(create=False):
    filenames = next(walk(FEEDS_DIR))[2]
    with app.app_context():
        init_db(create=create)
        for filename in filenames:
            uri = "file://" + FEEDS_DIR + filename
            feed = feedparser.parse(uri).feed
            title = feed["title"]
            add_feed(title, uri)


def usage():
    return """Usage:
        add_sample_feeds <action> <number of feeds <number of entries per feed
        where <action> is either create or add"""


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(usage())
    try:
        num_feeds = int(sys.argv[2])
        num_entries = int(sys.argv[3])
        create_sample_feed_files(num_feeds, num_entries)
        if sys.argv[1] == "create":
            add_feeds_to_db(create=True)
        elif sys.argv[1] == "add":
            add_feeds_to_db(create=False)
        else:
            raise ValueError
    except ValueError:
        sys.exit(usage())

