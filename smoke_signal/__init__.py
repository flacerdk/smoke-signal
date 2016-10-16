from flask import Flask, g
from smoke_signal.db import init
from smoke_signal.views import feed_view
from sqlalchemy.orm import sessionmaker

app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")
app.config.from_pyfile("config.py")
engine = init(app.config["DATABASE_PATH"])
Session = sessionmaker(bind=engine)
app.register_blueprint(feed_view)


@app.before_request
def before_request():
    g.db = Session()


@app.teardown_appcontext
def shutdown_session(exception=None):
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
