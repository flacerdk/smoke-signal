from server import app, init_db
from server.database.helpers import add_feed
from utils.generate_feed import SampleFeed

import feedparser
from os import walk, makedirs
from shutil import rmtree
import sys

FEEDS_DIR = app.root_path + "/test_resources/feeds/"

app.config['DATABASE_PATH'] = 'sqlite:///server/test_resources/posts.db'


def create_sample_feed_files(num_feeds, num_items, option="add"):
    if option == "create":
        rmtree(FEEDS_DIR)
    makedirs(FEEDS_DIR, exist_ok=True)
    for i in range(num_feeds):
        feed = SampleFeed("Test feed {}".format(i), num_items)
        filename = FEEDS_DIR + "feed{}.xml".format(i)
        with open(filename, "w+") as f:
            f.write(feed.__str__())


def add_feeds_to_db(option="add"):
    filenames = next(walk(FEEDS_DIR))[2]
    with app.app_context():
        if option == "create":
            init_db(create=True)
        else:
            init_db()
        for filename in filenames:
            uri = "file://" + FEEDS_DIR + filename
            feed = feedparser.parse(uri).feed
            title = feed["title"]
            add_feed(title, uri)


def usage():
    return """Usage:
        add_sample_feeds <action> <number of feeds> <number of entries per feed>
        where <action> is either create or add"""


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(usage())
    try:
        num_feeds = int(sys.argv[2])
        num_entries = int(sys.argv[3])
        if sys.argv[1] != "create" and sys.argv[1] != "add":
            raise ValueError
        create_sample_feed_files(num_feeds, num_entries, option=sys.argv[1])
        add_feeds_to_db(option=sys.argv[1])
    except ValueError:
        sys.exit(usage())
