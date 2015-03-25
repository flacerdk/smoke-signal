from __init__ import db, app
from database.models import Feed
import xml.etree.ElementTree as etree

def opml_to_dict(filename):
    tree = etree.parse(filename)
    feeds = tree.getroot().find('body').find('outline').findall('outline')
    return [{'title': f.attrib['title']} for f in feeds]

def add_feed_list(feeds):
    for f in feeds:
        feed = Feed(f['title'])
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
