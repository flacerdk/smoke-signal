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

def sample_feed(title, num_items):
    link = "http://example.com/{}".format(title)
    description = LOREM_IPSUM
    feed = RSS_20_HEADER.format(title=title, link=link, description=description)
    for i in range(num_items):
        item_title = "Item {}".format(i)
        item_link = "http://example.com/{}/{}".format(title, i)
        item_description = LOREM_IPSUM
        pubdate = formatdate(time()+86400*(num_items-i))
        guid = item_link
        feed += RSS_20_ITEM.format(title=item_title, link=item_link, description=item_description,
                                   pubdate=pubdate, guid=guid)
    return feed + RSS_20_FOOTER

