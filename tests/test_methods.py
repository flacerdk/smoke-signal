import json
import os
import unittest
import tempfile

from server import app
from .test_init import setup_db
from . import helpers


class MethodsTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = setup_db()
        self.app = app.test_client()
        self.feed_fds = []
        self.feeds = []
        self.feed, self.feed_path = self._add_feed(5)

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)
        for fd in self.feed_fds:
            os.close(fd)
        for (feed, feed_path) in self.feeds:
            os.unlink(feed_path)

    def _add_feed(self, num_entries):
        feed_fd, feed_path = tempfile.mkstemp()
        self.feed_fds.append(feed_fd)
        feed_title = "Test feed {}".format(len(self.feeds)+1)
        feed = helpers.add_mock_feed(self.app,
                                     feed_title,
                                     feed_path,
                                     num_entries)
        self.feeds.append((feed, feed_path))
        return feed, feed_path

    def test_add_feed_not_json(self):
        resp = self.app.post("/smoke_signal/feeds/")
        assert resp.status_code == 400

    def test_add_valid_feed(self):
        assert self.feed["title"] == "Test feed 1"
        assert self.feed["url"] == "file://" + self.feed_path
        assert "_links" in self.feed
        assert "self" in self.feed["_links"]
        assert "href" in self.feed["_links"]["self"]
        assert self.feed["_links"]["self"]["href"] == \
            "/feeds/{}".format(self.feed["id"])
        return self.feed

    def test_add_and_get_feed_list(self):
        resp = self.app.get("/smoke_signal/feeds/")
        assert resp.status_code == 200
        parsed_json = helpers.get_json(resp)
        assert "_embedded" in parsed_json
        feed_list = parsed_json["_embedded"]["feeds"]
        assert any(all(self.feed[k] == f[k] for k in self.feed.keys())
                   for f in feed_list)

    def test_add_feed_and_get_entries(self):
        resp = helpers.get_entries_response(self.app, self.feed)
        assert resp.status_code == 200
        entries = helpers.get_json(resp)
        assert entries["title"] == "Test feed 1"
        assert entries["url"] == "file://" + self.feed_path
        assert "_links" in entries
        assert "unread" in entries
        assert entries["unread"] == 5
        assert "_embedded" in entries
        assert len(entries["_embedded"]["entries"]) == 5

    def test_refresh_feed(self):
        resp = helpers.refresh_feed(self.app, self.feed, 10)
        assert resp.status_code == 200
        resp = self.app.get("/smoke_signal/feeds/{}".format(self.feed["id"]))
        assert resp.status_code == 200
        entry_list = helpers.get_json(resp)
        assert "_embedded" in entry_list
        entries = entry_list["_embedded"]["entries"]
        assert len(entries) == 10

    def test_refresh_feed_nonexistent(self):
        resp = self.app.post("/smoke_signal/feeds/0")
        assert resp.status_code == 404

    def test_mark_entry_as_read(self):
        resp = helpers.get_entries_response(self.app, self.feed)
        parsed_json = helpers.get_json(resp)
        assert "_embedded" in parsed_json
        entry_list = parsed_json["_embedded"]["entries"]
        entry = entry_list[0]
        assert entry["feed_id"] is not None
        assert entry["id"] is not None
        resp = helpers.change_entry_status(self.app, entry,
                                           {"read": True})
        assert resp.status_code == 200
        entry = helpers.get_json(resp)["_embedded"]["entry"]
        assert entry["read"]

    def test_feed_read(self):
        read_entry = helpers.change_first_entry(self.app, self.feed,
                                                {"read": True})
        resp = self.app.get("/smoke_signal/feeds/{}/read".format(read_entry["feed_id"]))
        assert resp.status_code == 200
        read_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry in read_entry_list
        assert len(read_entry_list) == 1

    def test_feed_read_not_in_unread(self):
        read_entry = helpers.change_first_entry(self.app, self.feed,
                                                {"read": True})
        resp = self.app.get("/smoke_signal/feeds/{}/unread".format(read_entry["feed_id"]))
        assert resp.status_code == 200
        unread_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry not in unread_entry_list
        assert len(unread_entry_list) == 4

    def test_feed_unread(self):
        unread_entry = helpers.change_first_entry(self.app, self.feed,
                                                  {"read": False})
        resp = self.app.get("/smoke_signal/feeds/{}/unread".format(unread_entry["feed_id"]))
        assert resp.status_code == 200
        unread_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry in unread_entry_list
        assert len(unread_entry_list) == 5

    def test_feed_unread_not_in_read(self):
        unread_entry = helpers.change_first_entry(self.app, self.feed,
                                                  {"read": False})
        resp = self.app.get("/smoke_signal/feeds/{}/read".format(unread_entry["feed_id"]))
        assert resp.status_code == 200
        read_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry not in read_entry_list
        assert read_entry_list == []

    def test_feed_marked(self):
        marked_entry = helpers.change_first_entry(self.app, self.feed,
                                                  {"marked": True})
        resp = self.app.get("/smoke_signal/feeds/{}/marked".format(
            marked_entry["feed_id"]))
        assert resp.status_code == 200
        marked = helpers.get_json(resp)["_embedded"]["entries"]
        assert marked_entry in marked

    def test_multiple_feeds(self):
        self._add_feed(5)
        resp = self.app.get("/smoke_signal/feeds/")
        assert resp.status_code == 200
        parsed_json = helpers.get_json(resp)
        assert "_embedded" in parsed_json
        feed_list = parsed_json["_embedded"]["feeds"]
        assert all(any(all(self.feed[k] == f[k] for k in self.feed.keys())
                       for f in feed_list) for feed in self.feeds)

    def test_multiple_feeds_get_all(self):
        self._add_feed(5)
        for (feed, feed_path) in self.feeds:
            self.app.post("/smoke_signal/feeds/{}".format(feed["id"]))
        resp = self.app.get("/smoke_signal/feeds/all")
        assert resp.status_code == 200
        parsed_json = helpers.get_json(resp)
        assert "_embedded" in parsed_json
        entry_list = parsed_json["_embedded"]["entries"]
        assert len(entry_list) == 10

    def test_all_feeds_unread(self):
        unread_entry = helpers.change_first_entry(self.app, self.feed,
                                                       {"read": False})
        resp = self.app.get("/smoke_signal/feeds/unread")
        assert resp.status_code == 200
        unread_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry in unread_entry_list

    def test_all_feeds_read(self):
        read_entry = helpers.change_first_entry(self.app, self.feed,
                                                {"read": True})
        resp = self.app.get("/smoke_signal/feeds/read")
        assert resp.status_code == 200
        read_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry in read_entry_list

    def test_all_feeds_unread_not_in_read(self):
        unread_entry = helpers.change_first_entry(self.app, self.feed,
                                                  {"read": False})
        resp = self.app.get("/smoke_signal/feeds/read")
        assert resp.status_code == 200
        read_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry not in read_entry_list

    def test_all_feeds_read_not_in_unread(self):
        read_entry = helpers.change_first_entry(self.app, self.feed,
                                                {"read": True})
        resp = self.app.get("/smoke_signal/feeds/unread")
        assert resp.status_code == 200
        unread_entry_list = helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry not in unread_entry_list

    def test_feed_invalid_predicate(self):
        resp = self.app.get("/smoke_signal/feeds/1/invalid")
        assert resp.status_code == 400

    def test_invalid_predicate(self):
        resp = self.app.get("/smoke_signal/feeds/invalid")
        assert resp.status_code == 400

    def test_change_entry_status_not_json(self):
        resp = self.app.post("/smoke_signal/feeds/1/1")
        assert resp.status_code == 400

    def test_change_entry_status_invalid_predicate(self):
        resp = self.app.post("/smoke_signal/feeds/1/1", data=json.dumps({"invalid": True}),
                             content_type="application/json")
        assert resp.status_code == 400

    def test_mark_all_read(self):
        resp = self.app.post("/smoke_signal/feeds/all", data=json.dumps({"read": True}),
                             content_type="application/json")
        assert resp.status_code == 200
        all_entries = helpers.get_json(self.app.get("/smoke_signal/feeds/all"))
        read_entries = helpers.get_json(self.app.get("/smoke_signal/feeds/read"))
        assert all_entries["_embedded"]["entries"] == \
            read_entries["_embedded"]["entries"]

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(MethodsTestCase)
    unittest.TextTestRunner(verbosity=2).run(suite)
