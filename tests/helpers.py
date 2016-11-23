import codecs
import json
from urllib.parse import urlparse

from utils.generate_feed import SampleFeed


def get_json(response):
    return json.loads(codecs.decode(response.get_data(), "utf-8"))


def create_mock_rss(title, feed_path, num_entries):
    feed = SampleFeed(title, num_entries)
    feed.write_to_file(feed_path)
    return feed_path


def add_feed(app, url):
    data = json.dumps({"url": url})
    return app.post("/feeds/", data=data,
                    content_type="application/json")


def add_mock_feed(test_app, title, feed_path, num_entries):
    feed_path = create_mock_rss(title, feed_path, num_entries)
    resp = add_feed(test_app, "file://" + feed_path)
    return get_json(resp)


def add_entries(feed, num_entries):
    title = feed["title"]
    feed_path = urlparse(feed["url"]).path
    new_feed = SampleFeed(title, num_entries)
    new_feed.write_to_file(feed_path)


def refresh_feed(app, feed, num_entries):
    add_entries(feed, num_entries)
    return app.post("/feeds/{}".format(feed["id"]))


def get_entries_response(app, feed):
    app.post("/feeds/{}".format(feed["id"]))
    return app.get("/feeds/{}".format(feed["id"]))


def change_first_entry(app, feed, data):
    parsed_json = get_json(get_entries_response(app, feed))
    entry_list = parsed_json["_embedded"]["entries"]
    entry = entry_list[0]
    return get_json(change_entry_status(app, entry, data))["_embedded"]["entry"]


def change_entry_status(app, entry, data):
    resp = app.post(
        "/feeds/{}/{}".format(entry["feed_id"],
                              entry["id"]),
        data=json.dumps(data),
        content_type="application/json")
    return resp
