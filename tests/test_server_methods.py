import json
import os
import unittest
import tempfile

from smoke_signal import app, init_db
from . import test_helpers


def setup_db():
    db_fd, db_path = tempfile.mkstemp()
    app.config['DATABASE_PATH'] = 'sqlite:///' + db_path
    app.config['TESTING'] = True
    with app.app_context():
        init_db()
    return db_fd, db_path


class InitTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = setup_db()
        self.app = app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

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


class MethodsTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = setup_db()
        self.app = app.test_client()
        self.feed_files = []
        self.feed, self.feed_path = self._add_feed()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)
        for (fd, path) in self.feed_files:
            os.close(fd)
            os.unlink(path)

    def _add_feed(self):
        self.feed_files.append(tempfile.mkstemp())
        feed_path = self.feed_files[0][1]
        feed = test_helpers.get_valid_feed(self.app,
                                           feed_path, 5)
        return feed, feed_path

    def test_add_valid_feed(self):
        assert self.feed["title"] == "Test feed"
        assert self.feed["url"] == "file://" + self.feed_path
        return self.feed

    def test_add_and_get_feed_list(self):
        resp = self.app.get("/feeds/")
        assert resp.status_code == 200
        parsed_json = test_helpers.get_json(resp)
        assert "_embedded" in parsed_json
        feed_list = parsed_json["_embedded"]["feeds"]
        assert any(all(self.feed[k] == f[k] for k in self.feed.keys())
                   for f in feed_list)

    def test_add_and_get_feed(self):
        resp = test_helpers.get_entries_response(self.app, self.feed)
        assert resp.status_code == 200

    def test_add_feed_and_get_entries(self):
        resp = test_helpers.get_entries_response(self.app, self.feed)
        entry_list = test_helpers.get_json(resp)
        assert entry_list != []

    def test_refresh_feed(self):
        resp = test_helpers.refresh_feed(self.app, self.feed, 10)
        assert resp.status_code == 200
        resp = self.app.get("/feeds/{}".format(self.feed["id"]))
        assert resp.status_code == 200
        entry_list = test_helpers.get_json(resp)
        assert "_embedded" in entry_list
        entries = entry_list["_embedded"]["entries"]
        assert len(entries) == 10

    def test_mark_entry_as_read(self):
        resp = test_helpers.get_entries_response(self.app, self.feed)
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
        read_entry = test_helpers.change_entry_status(self.app, self.feed,
                                                      read=True)
        resp = self.app.get("/feeds/{}/read".format(read_entry["feed_id"]))
        read_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry in read_entry_list
        resp = self.app.get("/feeds/{}/unread".format(read_entry["feed_id"]))
        unread_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert read_entry not in unread_entry_list

    def test_unread_entries(self):
        unread_entry = test_helpers.change_entry_status(self.app, self.feed,
                                                        read=False)
        resp = self.app.get("/feeds/{}/unread".format(unread_entry["feed_id"]))
        unread_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry in unread_entry_list
        resp = self.app.get("/feeds/{}/read".format(unread_entry["feed_id"]))
        assert resp.status_code == 200
        read_entry_list = test_helpers.get_json(resp)["_embedded"]["entries"]
        assert unread_entry not in read_entry_list


if __name__ == "__main__":
    test_cases = (InitTestCase, MethodsTestCase)
    suite = unittest.TestSuite()
    for test_class in test_cases:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
