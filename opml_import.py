from smoke_signal import db, app
from smoke_signal.database.models import Feed
import xml.etree.ElementTree as etree
import sys

def opml_to_dict(filename):
    tree = etree.parse(filename)
    feeds = tree.getroot().find('body').find('outline').findall('outline')
    return [{'title': f.attrib['title'], 'url': f.attrib['xmlUrl']} for f in feeds]

def add_feed_list(feeds):
    for f in feeds:
        feed = Feed(f['title'], f['url'])
        with app.app_context():
            db.session.add(feed)
            db.session.commit()

def opml_import(filename):
    feeds = opml_to_dict(filename)
    add_feed_list(feeds)

def create_db_from_opml(filename):
    with app.app_context():
        db.create_all()
    opml_import(filename)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: {name} opml_file".format(name=sys.argv[0]))
    create_db_from_opml(sys.argv[1])
