from flask import g
from smoke_signal.database.models import Feed
from smoke_signal import app, init_db
import xml.etree.ElementTree as etree
import sys


def opml_to_dict(filename):
    tree = etree.parse(filename)
    feeds = tree.getroot().find('body').find('outline').findall('outline')
    return [{'title': f.attrib['title'],
             'url': f.attrib['xmlUrl']} for f in feeds]


def add_feed_list(feeds):
    with app.app_context():
        init_db()
        session = g.db
        for f in feeds:
            feed = Feed(f['title'], f['url'])
            session.add(feed)
        session.commit()


def opml_import(filename):
    feeds = opml_to_dict(filename)
    add_feed_list(feeds)


def create_db_from_opml(filename):
    init_db()
    opml_import(filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
    opml_import(sys.argv[1])
