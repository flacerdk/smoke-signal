import codecs
import json
import os
from smoke_signal import app, init_db
from utils.generate_feed import SampleFeed
import unittest
import tempfile


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
        self.feed_fd, self.feed_path = tempfile.mkstemp()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)
        os.close(self.feed_fd)
        os.unlink(self.feed_path)

    def _generate_sample_rss(self, title, num_items):
        feed = SampleFeed(title)
        for i in range(num_items):
            feed.add_item()
        with open(self.feed_path, 'w') as f:
            f.write(feed.__str__())

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

    def _add_feed(self, url):
        return self.app.post('/feeds/', data=json.dumps({'url': url}),
                             content_type='application/json')

    def _get_valid_feed(self):
        self._generate_sample_rss("Test feed", 5)
        resp = self._add_feed("file://" + self.feed_path)
        return get_json(resp)

    def test_add_invalid_feed(self):
        resp = self._add_feed("http://example.com")
        assert resp.status_code == 404

    def test_add_valid_feed(self):
        data = self._get_valid_feed()
        assert data["title"] == "Test feed"
        assert data["url"] == "file://" + self.feed_path
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

    def _refresh_feed(self, feed):
        return self.app.post("/feeds/{}".format(feed["id"]))

    def _get_entries_response(self):
        feed = self._get_valid_feed()
        self._refresh_feed(feed)
        return self.app.get("/feeds/{}/entries".format(feed["id"]))

    def test_add_and_get_feed(self):
        resp = self._get_entries_response()
        assert resp.status_code == 200

    def test_add_feed_and_get_entries(self):
        resp = self._get_entries_response()
        entry_list = get_json(resp)
        assert entry_list != []

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

    def _change_entry_status(self, read):
        entry_list = get_json(self._get_entries_response())["_embedded"]["entries"]
        entry = entry_list[0]
        resp = self.app.post(
            "/feeds/{}/entries/{}".format(entry["feed_id"],
                                          entry["id"]),
            data=json.dumps({"read": read}),
            content_type="application/json")
        return get_json(resp)

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
    unittest.main()
