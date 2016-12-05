from flask import g
from .database.models import Feed
import server
import xml.etree.ElementTree as etree
import sys


def opml_to_dict(filename):
    tree = etree.parse(filename)
    feeds = tree.getroot().find('body').find('outline').findall('outline')
    return [{'title': f.attrib['title'],
             'url': f.attrib['xmlUrl']} for f in feeds]


def add_feed_list(feeds):
    server.init_db()
    session = g.db
    for f in feeds:
        feed = Feed(f['title'], f['url'])
        session.add(feed)
    session.commit()


def opml_import(filename):
    feeds = opml_to_dict(filename)
    add_feed_list(feeds)


def create_db_from_opml(filename):
    server.init_db(create=True)
    opml_import(filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
    opml_import(sys.argv[1])
