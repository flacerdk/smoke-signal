import os
from sqlalchemy import create_engine

DATABASE = "smoke-signal.db"
if __name__ == "__main__":
    basedir = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(basedir, DATABASE)
    db = create_engine("sqlite:///" + DATABASE_PATH)
else:
    db = create_engine("sqlite:///:memory:", echo=True)
