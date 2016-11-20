import os
import unittest
import tempfile

from smoke_signal import app, init_app
from . import helpers


def setup_db():
    db_fd, db_path = tempfile.mkstemp()
    app.config["DATABASE_PATH"] = "sqlite:///" + db_path
    app.config["TESTING"] = True
    app.config["WTF_CSRF_ENABLED"] = False
    app.config["USER_NAME"] = "Test"
    app.config["PASSWORD"] = "Test"
    with app.app_context():
        init_app()
    return db_fd, db_path


class LoginTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = setup_db()
        self.app = app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_login(self):
        resp = self.app.post("/login", data={
            "name": "Test",
            "password": "Test"
        })
        assert resp.status_code == 302

    def test_get_feeds(self):
        self.app.post("/login", data={
            "name": "Test",
            "password": "Test"
        })
        resp = self.app.get("/feeds/")
        assert resp.status_code == 200
        assert "_embedded" in helpers.get_json(resp)

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(LoginTestCase)
    unittest.TextTestRunner(verbosity=2).run(suite)
