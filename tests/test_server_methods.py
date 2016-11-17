import json
import os
import unittest
import tempfile

from smoke_signal import app, init_db
from . import test_helpers


class SmokeSignalTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        app.config['DATABASE_PATH'] = 'sqlite:///' + self.db_path
        app.config['TESTING'] = True
        self.app = app.test_client()
        with app.app_context():
            init_db()
        self.feed_files = []

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)
        for (fd, path) in self.feed_files:
            os.close(fd)
            os.unlink(path)

    def _add_feed_file(self):
        feed_fd, feed_path = tempfile.mkstemp()
        self.feed_files.append((feed_fd, feed_path))
        return feed_path

    def test_alive(self):
        resp = self.app.get('/')
        assert resp.status_code == 200

    def test_empty_feed_list(self):
        resp = self.app.get('/feeds/')
        assert resp.status_code == 200
        feeds = test_helpers.get_json(resp)["_embedded"]["feeds"]
        assert feeds == []
        resp = self.app.get('/feeds/1')
        assert resp.status_code == 404

    def test_add_invalid_feed(self):
        resp = test_helpers.add_feed(self.app, "http://example.com")
        assert resp.status_code == 404

    def test_add_valid_feed(self):
        feed_path = self._add_feed_file()
        data = test_helpers.get_valid_feed(self.app, feed_path)
        assert data["title"] == "Test feed"
        assert data["url"] == "file://" + feed_path
        return data

    def test_add_and_get_feed_list(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        resp = self.app.get("/feeds/")
        assert resp.status_code == 200
        parsed_json = test_helpers.get_json(resp)
        assert "_embedded" in parsed_json
        feed_list = parsed_json["_embedded"]["feeds"]
        assert any(all(feed[k] == f[k] for k in feed.keys())
                   for f in feed_list)

    def test_add_and_get_feed(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        resp = test_helpers.get_entries_response(self.app, feed)
        assert resp.status_code == 200

    def test_add_feed_and_get_entries(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        resp = test_helpers.get_entries_response(self.app, feed)
        entry_list = test_helpers.get_json(resp)
        assert entry_list != []

    def test_refresh_feed(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        test_helpers.refresh_feed(self.app, feed, add=True)
        resp = self.app.get("/feeds/{}".format(feed["id"]))
        assert resp.status_code == 200
        entry_list = test_helpers.get_json(resp)
        assert "_embedded" in entry_list
        entries = entry_list["_embedded"]["entries"]
        assert len(entries) == 10

    def test_mark_entry_as_read(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        resp = test_helpers.get_entries_response(self.app, feed)
        parsed_json = test_helpers.get_json(resp)
        assert "_embedded" in parsed_json
        entry_list = parsed_json["_embedded"]["entries"]
        entry = entry_list[0]
        assert entry["feed_id"] is not None
        assert entry["id"] is not None
        resp = self.app.post("/feeds/{}/{}".format(entry["feed_id"],
                                                   entry["id"]),
                             data=json.dumps({"read": True}),
                             content_type="application/json")
        assert resp.status_code == 200
        entry = test_helpers.get_json(resp)
        assert entry["read"]

    def test_read_entries(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        read_entry = test_helpers.change_entry_status(self.app, feed,
                                                      read=True)
        resp = self.app.get("/feeds/{}/read".format(read_entry["feed_id"]))
        read_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry in read_entry_list
        resp = self.app.get("/feeds/{}/unread".format(read_entry["feed_id"]))
        unread_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry not in unread_entry_list

    def test_unread_entries(self):
        feed_path = self._add_feed_file()
        feed = test_helpers.get_valid_feed(self.app, feed_path)
        unread_entry = test_helpers.change_entry_status(self.app, feed,
                                                        read=False)
        resp = self.app.get("/feeds/{}/unread".format(unread_entry["feed_id"]))
        unread_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry in unread_entry_list
        resp = self.app.get("/feeds/{}/read".format(unread_entry["feed_id"]))
        assert resp.status_code == 200
        read_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry not in read_entry_list


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(SmokeSignalTestCase)
    unittest.TextTestRunner(verbosity=2).run(suite)
