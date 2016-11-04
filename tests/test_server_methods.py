import codecs
import json
import os
from smoke_signal import app, init_db
import unittest
import tempfile

SAMPLE_RSS = "file://" + app.root_path + "/test_resources/sample_rss.xml"


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

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_alive(self):
        resp = self.app.get('/')
        assert resp.status_code == 200

    def test_empty_feedlist(self):
        resp = self.app.get('/feeds/')
        assert resp.status_code == 204
        resp = self.app.get('/feeds/1')
        assert resp.status_code == 404

    def add_feed(self, url):
        return self.app.post('/feeds/', data=json.dumps({'url': url}),
                             content_type='application/json')

    def test_add_invalid_feed(self):
        resp = self.add_feed("http://example.com")
        assert resp.status_code == 404

    def test_add_valid_feed(self):
        resp = self.add_feed(SAMPLE_RSS)
        assert resp.status_code == 200
        data = get_json(resp)
        assert data["url"] == SAMPLE_RSS
        return data

    def test_add_and_get_feed_list(self):
        feed = self.test_add_valid_feed()
        resp = self.app.get("/feeds/")
        assert resp.status_code == 200
        feed_list = get_json(resp)
        assert feed in feed_list

    def test_add_and_get_feed(self):
        feed = self.test_add_valid_feed()
        resp = self.app.get("/feeds/{}".format(feed["id"]))
        assert resp.status_code == 200
        entry_list = get_json(resp)
        assert entry_list != []
        return entry_list

    def test_mark_entry_as_read(self):
        entry_list = self.test_add_and_get_feed()
        entry = entry_list[0]
        assert entry["feed_id"] is not None
        assert entry["entry_id"] is not None
        resp = self.app.post("/feeds/{}/read/{}".format(entry["feed_id"],
                                                        entry["entry_id"]))
        assert resp.status_code == 200
        entry = get_json(resp)
        assert entry["read"]

if __name__ == "__main__":
    unittest.main()
