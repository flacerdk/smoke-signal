import urllib2
import xml.etree.ElementTree as etree
from smoke_signal import db, app
from smoke_signal.database.models import Feed, Entry

def read_feed(feed):
    feed_id = feed.id
    url = feed.url
    rss = urllib2.urlopen(url)
    tree = etree.parse(rss)
    root = tree.getroot()
    entries = root.find('channel').findall('item')
    for e in entries:
        title = e.find('title').text
        guid = e.find('guid').text
        text = e.find('description').text
        if db.session.query(Entry).filter(Entry.guid == guid).all() == []:
            entry = Entry(title, guid, text, feed_id)
            with app.app_context():
                db.session.add(entry)
                db.session.commit()
