from smoke_signal import db
import os


if __name__ == "__main__":
    DATABASE = "smoke-signal.db"
    basedir = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = "sqlite:///" + os.path.join(basedir, DATABASE)
    engine = db.init(DATABASE_PATH)
engine = db.init_memory()
