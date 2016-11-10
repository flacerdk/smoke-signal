from smoke_signal import app, init_db
from smoke_signal.database.helpers import add_feed
from utils.generate_feed import SampleFeed

from os import walk

feeds_dir = app.root_path + "/test_resources/feeds/"

app.config['DATABASE_PATH'] = 'sqlite:///smoke_signal/test_resources/posts.db'


def create_sample_feed_files(num_feeds, num_items):
    for i in range(num_feeds):
        feed = SampleFeed("Test feed {}".format(i))
        for j in range(num_items):
            feed.add_item()
        filename = feeds_dir + "feed{}.xml".format(i)
        with open(filename, "w+") as f:
            f.write(feed.__str__())


def add_feeds_to_db():
    filenames = next(walk(feeds_dir))[2]
    with app.app_context():
        init_db()
        for filename in filenames:
            add_feed("file://" + feeds_dir + filename)
