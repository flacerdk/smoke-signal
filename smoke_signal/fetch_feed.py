import urllib2
from lxml import etree
from smoke_signal import db, app
from smoke_signal.database.models import Feed, Entry

NSMAP = {"atom": "http://www.w3.org/2005/Atom",
         "rss10": "http://purl.org/rss/1.0/",
         "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}

def read_feed(feed):
    feed_id = feed.id
    url = feed.url
    rss = urllib2.urlopen(url)
    tree = etree.parse(rss)
    root = tree.getroot()
    if None in root.nsmap and root.nsmap[None] == NSMAP["rss10"]:
        read_rss10(feed_id, root)
    elif None in root.nsmap and root.nsmap[None] == NSMAP["atom"]:
        read_atom(feed_id, root)
    else:
        read_rss20(feed_id, root)

def read_rss20(feed_id, root):
    entries = root.find('channel').findall('item')
    for e in entries:
        attributes = {'feed_id': feed_id}
        tags = ['title', 'guid', 'description']
        for t in tags:
            attr = e.find(t)
            if attr != None:
                if attr.getchildren() == []:
                    content = attr.text
                else:
                    content = "".join(etree.tostring(s) for s in attr.getchildren())
            else:
                content = ""
            attributes[t] = content
        if db.session.query(Entry).filter(Entry.guid == attributes['guid']).all() == []:
            entry = Entry(**attributes)
            with app.app_context():
                db.session.add(entry)
                db.session.commit()

def read_atom(feed_id, root):
    ns = "{" + NSMAP["atom"] + "}"
    entries = root.findall("{ns}entry".format(ns=ns))
    for e in entries:
        attributes = {'feed_id': feed_id}
        tags = ['title', 'id', 'content']
        for t in tags:
            attr = e.find(("{ns}" + t).format(ns=ns))
            if attr != None:
                if attr.getchildren() == []:
                    content = attr.text
                else:
                    content = "".join(etree.tostring(s) for s in attr.getchildren())
            else:
                content = ""
            attributes[t] = content
        if db.session.query(Entry).filter(Entry.guid == attributes['id']).all() == []:
            entry = Entry(attributes['title'], attributes['id'],
                          attributes['content'], attributes['feed_id'])
            with app.app_context():
                db.session.add(entry)
                db.session.commit()

def read_rss10(feed_id, root):
    ns = "{" + NSMAP["rss10"] + "}"
    entries = root.findall('{ns}item'.format(ns=ns))
    for e in entries:
        attributes = {'feed_id': feed_id}
        tags = ['title', 'link', 'description']
        for t in tags:
            attr = e.find(("{ns}" + t).format(ns=ns))
            if attr != None:
                if attr.getchildren() == []:
                    content = attr.text
                else:
                    content = "".join(etree.tostring(s) for s in attr.getchildren())
            else:
                content = ""
            attributes[t] = content
        if db.session.query(Entry).filter(Entry.guid == attributes['link']).all() == []:
            entry = Entry(attributes['title'], attributes['link'],
                          attributes['description'], attributes['feed_id'])
            with app.app_context():
                db.session.add(entry)
                db.session.commit()
