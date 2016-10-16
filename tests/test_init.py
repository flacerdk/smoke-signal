import os
from smoke_signal import app, init_db
import unittest
import tempfile


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

    def test_main_page(self):
        resp = self.app.get('/')
        assert b'Feeds' in resp.data

if __name__ == "__main__":
    unittest.main()
