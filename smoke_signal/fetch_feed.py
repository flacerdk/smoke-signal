import urllib2
from lxml import etree
from smoke_signal import db, app
from smoke_signal.database.models import Feed, Entry

NSMAP = {"atom": "http://www.w3.org/2005/Atom",
         "rss10": "http://purl.org/rss/1.0/",
         "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}

class FeedFormat():
    def __init__(self, entries_path, tag_map, ns):
        self.entries_path = entries_path
        self.tag_map = tag_map
        self.ns = ns
        self.attributes = {}

    def read(self, feed_id, root):
        attributes = {'feed_id': feed_id}
        node = root
        for tag in self.entries_path:
            node = node.findall(("{ns}"+tag).format(ns=self.ns))
            if len(node) == 1:
                node = node[0]
        for entry in node:
            for attr in self.tag_map.keys():
                tag = entry.find(("{ns}" + self.tag_map[attr]).format(ns=self.ns))
                if tag != None:
                    if tag.getchildren() == []:
                        content = tag.text
                    else:
                        content = "".join(etree.tostring(s) for s in tag.getchildren())
                else:
                    content = ""
                attributes[attr] = content
            if db.session.query(Entry).filter(Entry.guid == attributes['guid']).all() == []:
                entry = Entry(**attributes)
                with app.app_context():
                    db.session.add(entry)
                    db.session.commit()

rss10 = FeedFormat(["item"],
                   {"title": "title", "guid": "link", "text": "description"},
                   "{" + NSMAP["rss10"] + "}")
rss20 = FeedFormat(["channel", "item"],
                   {"title": "title", "guid": "guid", "text": "description"},
                   "")
atom = FeedFormat(["entry"],
                   {"title": "title", "guid": "id", "text": "content"},
                   "{" + NSMAP["atom"] + "}")

def read_feed(feed):
    feed_id = feed.id
    url = feed.url
    rss = urllib2.urlopen(url)
    tree = etree.parse(rss)
    root = tree.getroot()
    if None in root.nsmap and root.nsmap[None] == NSMAP["rss10"]:
        rss10.read(feed_id, root)
    elif None in root.nsmap and root.nsmap[None] == NSMAP["atom"]:
        atom.read(feed_id, root)
    else:
        rss20.read(feed_id, root)
