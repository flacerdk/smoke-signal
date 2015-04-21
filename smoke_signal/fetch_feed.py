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
        attributes = {'feed_id': feed_id}
        tags = ['title', 'guid', 'description']
        for t in tags:
            attr = e.find(t)
            if attr != None:
                content = attr.text
            else:
                content = ""
            attributes[t] = content
        if db.session.query(Entry).filter(Entry.guid == attributes['guid']).all() == []:
            entry = Entry(**attributes)
            with app.app_context():
                db.session.add(entry)
                db.session.commit()
