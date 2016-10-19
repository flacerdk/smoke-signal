from flask import g
from .opml_import import opml_to_dict
from smoke_signal import app, init_db
from smoke_signal.database.models import Feed
import sys
from urllib.request import urlopen, URLError

feeds_dir = app.root_path + "/test_resources/feeds/"

app.config['DATABASE_PATH'] = 'sqlite:///smoke_signal/test_resources/posts.db'
if len(sys.argv) != 2:
    sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
feeds = opml_to_dict(sys.argv[1])
with app.app_context():
    init_db()
    session = g.db
    i = 0
    for feed in feeds:
        try:
            response = urlopen(feed["url"])
            filename = feeds_dir + "feed{}.xml".format(i)
            with open(filename, "wb+") as f:
                f.write(response.read())
            session.add(Feed(feed['title'], "file://" + filename))
            i += 1
        except URLError:
            print("{} doesn't seem to exist, skipping".format(feed["url"]))
    session.commit()
