from email.utils import formatdate
from time import time

RSS_20_HEADER = """<?xml version="1.0"?>
<rss version="2.0">
   <channel>
      <title>{title}</title>
      <link>{link}</link>
      <description>{description}</description>
"""

RSS_20_ITEM = """
      <item>
         <title>{title}</title>
         <link>{link}</link>
         <description>{description}</description>
         <pubDate>{pubdate}</pubDate>
         <guid>{guid}</guid>
      </item>
"""

RSS_20_FOOTER = """
   </channel>
</rss>
"""

LOREM_IPSUM = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean enim nunc, aliquam vitae molestie vitae, porttitor quis lorem. Pellentesque in consequat dui. Cras libero velit, laoreet blandit ullamcorper sed, sagittis sit amet eros. Integer sagittis elit ut arcu hendrerit, a dapibus quam vulputate. Phasellus a tortor suscipit, sollicitudin nunc ac, laoreet sapien. Nullam tincidunt eget ipsum eu fermentum. Pellentesque bibendum et nunc non faucibus. Pellentesque et risus scelerisque, ullamcorper purus ac, dignissim nunc.
"""


class SampleFeed:
    def __init__(self, title, num_items):
        self.title = title
        link = "http://example.com/{}".format(title)
        description = LOREM_IPSUM
        self.header = RSS_20_HEADER.format(title=title, link=link,
                                           description=description)
        self.footer = RSS_20_FOOTER
        self.items = []
        for i in range(num_items):
            self.add_item()

    def add_item(self):
        i = len(self.items) + 1
        item_title = "Item {}".format(i)
        item_link = "http://example.com/{}/{}".format(self.title, i)
        item_description = LOREM_IPSUM
        pubdate = formatdate(time()+86400*i)
        guid = item_link
        item = RSS_20_ITEM.format(title=item_title, link=item_link,
                                  description=item_description,
                                  pubdate=pubdate, guid=guid)
        self.items.append(item)

    def __str__(self):
        items = list(self.items)
        items.reverse()
        return self.header + "\n".join(items) + self.footer

    def write_to_file(self, path):
        with open(path, "w") as f:
            f.write(self.__str__())
