from smoke_signal.database.models import Feed, Base
from smoke_signal.db import init
from config import DATABASE_PATH
import xml.etree.ElementTree as etree
import sys
from sqlalchemy.orm import sessionmaker

engine = init(DATABASE_PATH)
Session = sessionmaker(bind=engine)


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
    Base.metadata.create_all(engine)
    opml_import(filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
    opml_import(sys.argv[1])
