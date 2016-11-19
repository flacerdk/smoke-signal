from flask import Flask, g
from flask_login import current_user, LoginManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from smoke_signal.database.models import Base, User
from .main.views import main

app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")
app.config.from_pyfile("config.py")
app.register_blueprint(main)


@app.before_first_request
def init_app():
    init_db(create=False)
    g.db.query(User).delete()
    user = User(app.config["USER_NAME"], app.config["PASSWORD"])
    g.db.add(user)
    g.db.commit()
    g.user = current_user


@app.before_request
def init_db(create=False):
    engine = create_engine(app.config["DATABASE_PATH"])
    Session = sessionmaker(bind=engine)
    g.db = Session()
    if create or not engine.dialect.has_table(engine.connect(), "feed"):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()


login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return g.db.query(User).get(int(user_id))
