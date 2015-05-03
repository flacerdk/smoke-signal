import urllib2
from lxml import etree
from BeautifulSoup import BeautifulSoup
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
                if tag is not None:
                    if attr == "text":
                        # strip all HTML tags. Should do something smarter in the future
                        content = BeautifulSoup(tag.text).text
                    elif attr == "url" and tag.text is None:
                        content = tag.attrib['href']
                    else:
                        content = tag.text
                else:
                    content = ""
                attributes[attr] = content
            if db.session.query(Entry).filter(Entry.guid == attributes['guid']).all() == []:
                entry = Entry(**attributes)
                with app.app_context():
                    db.session.add(entry)
                    db.session.commit()

# An RSS entry is identified by the tag "item"
rss10 = FeedFormat(["item"],
                   {"title": "title", "guid": "link", "url": "link", "text": "description"},
                   # RSS 1.0 requires a namespace
                   "{" + NSMAP["rss10"] + "}")

# differently from RSS 1.0, items are inside a "channel" element.
rss20 = FeedFormat(["channel", "item"],
                   {"title": "title", "guid": "guid", "url": "link", "text": "description"},
                   # no namespace, though!
                   "")
atom = FeedFormat(["entry"],
                   {"title": "title", "guid": "id", "url": "link[@rel='alternate']", "text": "content"},
                   "{" + NSMAP["atom"] + "}")

def read_feed(feed):
    feed_id = feed.id
    url = feed.url
    rss = urllib2.urlopen(url)
    tree = etree.parse(rss)
    root = tree.getroot()
    # identify the format based on which namespace they're using (or not, in
    # the case of RSS 2.0). probably not the smartest way to do this, but it
    # is working so far.
    if None in root.nsmap and root.nsmap[None] == NSMAP["rss10"]:
        rss10.read(feed_id, root)
    elif None in root.nsmap and root.nsmap[None] == NSMAP["atom"]:
        atom.read(feed_id, root)
    else:
        rss20.read(feed_id, root)
