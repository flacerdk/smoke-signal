from smoke_signal.database.models import Feed, create_all
from smoke_signal.db import db
import xml.etree.ElementTree as etree
import sys
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=db)


def opml_to_dict(filename):
    tree = etree.parse(filename)
    feeds = tree.getroot().find('body').find('outline').findall('outline')
    return [{'title': f.attrib['title'],
             'url': f.attrib['xmlUrl']} for f in feeds]


def add_feed_list(feeds):
    for f in feeds:
        feed = Feed(f['title'], f['url'])
        session = Session()
        session.add(feed)
        session.commit()


def opml_import(filename):
    feeds = opml_to_dict(filename)
    add_feed_list(feeds)


def create_db_from_opml(filename):
    create_all(db)
    opml_import(filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
    create_db_from_opml(sys.argv[1])
