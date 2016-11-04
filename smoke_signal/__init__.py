from flask import Flask, g
from .main.views import main
from .nojs.views import nojs
from sqlalchemy import create_engine
from smoke_signal.database.models import Base
from sqlalchemy.orm import sessionmaker

app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")
app.config.from_pyfile("config.py")
app.register_blueprint(main)
app.register_blueprint(nojs)


@app.before_request
def init_db():
    engine = create_engine(app.config["DATABASE_PATH"])
    if not engine.dialect.has_table(engine.connect(), "feed"):
        Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    g.db = Session()


@app.teardown_appcontext
def shutdown_session(exception=None):
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
