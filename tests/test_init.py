import codecs
import json
import os
from smoke_signal import app, init_db
import unittest
import tempfile

# Sample RSS for testing. This will fail whenever the NYT changes the URL
# for the RSS feed.
#
# TODO: change this to a URL that doesn't depend on an external service
SAMPLE_RSS = "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"


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
        resp = self.app.get('/get_feed/0')
        assert resp.status_code == 404

    def add_feed(self, url):
        return self.app.post('/add_feed', data=dict(url=url))

    def test_add_invalid_feed(self):
        resp = self.add_feed("http://example.com")
        assert resp.status_code == 404

    def test_add_valid_feed(self):
        resp = self.add_feed(SAMPLE_RSS)
        assert resp.status_code == 200
        data = json.loads(codecs.decode(resp.data, 'utf-8'))
        assert data["url"] == SAMPLE_RSS
        return data

    def test_add_and_get_feed_list(self):
        feed = self.test_add_valid_feed()
        resp = self.app.get("/get_feed_list")
        assert resp.status_code == 200
        feed_list = json.loads(codecs.decode(resp.data, 'utf-8'))
        assert feed in feed_list

    def test_add_and_get_feed(self):
        feed = self.test_add_valid_feed()
        resp = self.app.get("/get_feed/{}".format(feed["id"]))
        assert resp.status_code == 200

if __name__ == "__main__":
    unittest.main()
