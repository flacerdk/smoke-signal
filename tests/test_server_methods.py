import codecs
import json
import os
import unittest
from urllib.parse import urlparse
import tempfile

from smoke_signal import app, init_db
from utils.generate_feed import SampleFeed


def get_json(response):
    return json.loads(codecs.decode(response.get_data(), 'utf-8'))


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

    def _generate_sample_rss(self, title, num_entries):
        feed = SampleFeed(title)
        for i in range(num_entries):
            feed.add_item()
        feed_fd, feed_path = tempfile.mkstemp()
        self.feed_files.append((feed_fd, feed_path))
        with open(feed_path, 'w') as f:
            f.write(feed.__str__())
        return feed_fd, feed_path

    def _add_feed(self, url):
        return self.app.post('/feeds/', data=json.dumps({'url': url}),
                             content_type='application/json')

    def _get_valid_feed(self):
        feed_fd, feed_path = self._generate_sample_rss("Test feed", 5)
        resp = self._add_feed("file://" + feed_path)
        return get_json(resp)

    def _add_entries(self, feed, num_entries):
        title = feed["title"]
        feed_path = urlparse(feed["url"]).path
        new_feed = SampleFeed(title)
        for i in range(num_entries):
            new_feed.add_item()
        with open(feed_path, 'w') as f:
            f.write(new_feed.__str__())

    def _refresh_feed(self, feed, add_entries=False):
        if add_entries:
            self._add_entries(feed, 10)
        return self.app.post("/feeds/{}".format(feed["id"]))

    def _get_entries_response(self):
        feed = self._get_valid_feed()
        self._refresh_feed(feed)
        return self.app.get("/feeds/{}/entries".format(feed["id"]))

    def _change_entry_status(self, read):
        entry_list = get_json(self._get_entries_response())["_embedded"]["entries"]
        entry = entry_list[0]
        resp = self.app.post(
            "/feeds/{}/entries/{}".format(entry["feed_id"],
                                          entry["id"]),
            data=json.dumps({"read": read}),
            content_type="application/json")
        return get_json(resp)

    def test_alive(self):
        resp = self.app.get('/')
        assert resp.status_code == 200

    def test_empty_feed_list(self):
        resp = self.app.get('/feeds/')
        assert resp.status_code == 200
        feeds = get_json(resp)["_embedded"]["feeds"]
        assert feeds == []
        resp = self.app.get('/feeds/1/entries')
        assert resp.status_code == 404

    def test_add_invalid_feed(self):
        resp = self._add_feed("http://example.com")
        assert resp.status_code == 404

    def test_add_valid_feed(self):
        data = self._get_valid_feed()
        feed_path = self.feed_files[-1][1]
        assert data["title"] == "Test feed"
        assert data["url"] == "file://" + feed_path
        return data

    def test_add_and_get_feed_list(self):
        feed = self._get_valid_feed()
        resp = self.app.get("/feeds/")
        assert resp.status_code == 200
        parsed_json = get_json(resp)
        assert "_embedded" in parsed_json
        feed_list = parsed_json["_embedded"]["feeds"]
        assert any(all(feed[k] == f[k] for k in feed.keys())
                   for f in feed_list)

    def test_add_and_get_feed(self):
        resp = self._get_entries_response()
        assert resp.status_code == 200

    def test_add_feed_and_get_entries(self):
        resp = self._get_entries_response()
        entry_list = get_json(resp)
        assert entry_list != []

    def test_refresh_feed(self):
        feed = self._get_valid_feed()
        self._refresh_feed(feed, add_entries=True)
        resp = self.app.get("/feeds/{}/entries".format(feed["id"]))
        assert resp.status_code == 200
        entry_list = get_json(resp)
        assert "_embedded" in entry_list
        entries = entry_list["_embedded"]["entries"]
        assert len(entries) == 10

    def test_mark_entry_as_read(self):
        parsed_json = get_json(self._get_entries_response())
        assert "_embedded" in parsed_json
        entry_list = parsed_json["_embedded"]["entries"]
        entry = entry_list[0]
        assert entry["feed_id"] is not None
        assert entry["id"] is not None
        resp = self.app.post("/feeds/{}/entries/{}".format(entry["feed_id"],
                                                           entry["id"]),
                             data=json.dumps({"read": True}),
                             content_type="application/json")
        assert resp.status_code == 200
        entry = get_json(resp)
        assert entry["read"]

    def test_read_entries(self):
        read_entry = self._change_entry_status(read=True)
        resp = self.app.get("/feeds/{}/entries/read".format(read_entry["feed_id"]))
        read_entry_list = get_json(resp)["_embedded"]["entries"]
        assert read_entry in read_entry_list
        resp = self.app.get("/feeds/{}/entries/unread".format(read_entry["feed_id"]))
        unread_entry_list = get_json(resp)["_embedded"]["entries"]
        assert read_entry not in unread_entry_list

    def test_unread_entries(self):
        unread_entry = self._change_entry_status(read=False)
        resp = self.app.get("/feeds/{}/entries/unread".format(unread_entry["feed_id"]))
        unread_entry_list = get_json(resp)["_embedded"]["entries"]
        assert unread_entry in unread_entry_list
        resp = self.app.get("/feeds/{}/entries/read".format(unread_entry["feed_id"]))
        assert resp.status_code == 200
        read_entry_list = get_json(resp)["_embedded"]["entries"]
        assert unread_entry not in read_entry_list


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(SmokeSignalTestCase)
    unittest.TextTestRunner(verbosity=2).run(suite)
