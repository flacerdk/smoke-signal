import os
import unittest
import tempfile

from smoke_signal import app, init_app
from . import helpers


def setup_db():
    db_fd, db_path = tempfile.mkstemp()
    app.config['DATABASE_PATH'] = 'sqlite:///' + db_path
    app.config['TESTING'] = True
    app.config['LOGIN_DISABLED'] = True
    with app.app_context():
        init_app()
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
        feeds = helpers.get_json(resp)["_embedded"]["feeds"]
        assert feeds == []
        resp = self.app.get('/feeds/1')
        assert resp.status_code == 404


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(InitTestCase)
    unittest.TextTestRunner(verbosity=2).run(suite)
