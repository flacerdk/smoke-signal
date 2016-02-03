import urllib2
from lxml import etree
from BeautifulSoup import BeautifulSoup
from smoke_signal.db import db
from smoke_signal.database.models import Entry
from sqlalchemy.orm import sessionmaker

NSMAP = {"atom": "http://www.w3.org/2005/Atom",
         "rss10": "http://purl.org/rss/1.0/",
         "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}
Session = sessionmaker(bind=db)


class FeedFormat():
    def __init__(self, entries_path, tag_map, ns):
        self.entries_path = entries_path
        self.tag_map = tag_map
        self.ns = ns
        self.attributes = {}

    def parse(self, feed_id, root):
        attributes = {'feed_id': feed_id}
        node = root
        entries = []
        session = Session()
        for tag in self.entries_path:
            node = node.findall(("{ns}"+tag).format(ns=self.ns))
            if len(node) == 1:
                node = node[0]
        for entry in node:
            for attr in self.tag_map.keys():
                tag = ("{ns}" + self.tag_map[attr]).format(ns=self.ns)
                content = entry.find(tag)
                if content is not None:
                    if attr == "text":
                        # strip all HTML tags.
                        # Should do something smarter in the future
                        html = BeautifulSoup.HTML_ENTITIES
                        text = BeautifulSoup(content.text,
                                             convertEntities=html).text
                    elif attr == "url" and content.text is None:
                        text = content.attrib['href']
                    else:
                        text = content.text
                else:
                    text = ""
                attributes[attr] = text
            try:
                guid = attributes["guid"]
            except KeyError:
                print "No GUID!"
            query = session.query(Entry).filter(Entry.guid == guid)
            if query.all() == []:
                e = Entry(**attributes)
                entries.append(e)
        return entries

# An RSS 1.0 entry is identified by the tag "item"
# Also, RSS 1.0 requires a namespace.
rss10_attr = {"title": "title", "guid": "link",
              "url": "link", "text": "description"}
rss10 = FeedFormat(["item"], rss10_attr, "{" + NSMAP["rss10"] + "}")
# differently from RSS 1.0, items are inside a "channel" element.
# No namespace, though!
rss20_attr = {"title": "title", "guid": "guid",
              "url": "link", "text": "description"}
rss20 = FeedFormat(["channel", "item"], rss20_attr, "")
atom_attr = {"title": "title", "guid": "id", "url": "link[@rel='alternate']",
             "text": "content"},
atom = FeedFormat(["entry"], atom_attr, "{" + NSMAP["atom"] + "}")


# Identify the format based on which namespace they're using (or not, in
# the case of RSS 2.0). probably not the smartest way to do this, but it
# is working so far.
def detect_format(nsmap):
    if None in nsmap and nsmap[None] == NSMAP["rss10"]:
        return rss10
    elif None in nsmap and nsmap[None] == NSMAP["atom"]:
        return atom
    else:
        return rss20


def parse_feed(feed):
    feed_id = feed.id
    url = feed.url
    try:
        rss = urllib2.urlopen(url)
    except urllib2.HTTPError:
        raise
    tree = etree.parse(rss)
    root = tree.getroot()
    f = detect_format(root.nsmap)
    return f.parse(feed_id, root)
