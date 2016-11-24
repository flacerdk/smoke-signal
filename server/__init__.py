from flask import Flask, g
from flask_wtf.csrf import CsrfProtect
from flask_login import current_user, LoginManager
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash

from server.database.models import Base, User
from .main.views import main

app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")
app.config.from_pyfile("config.py")
app.register_blueprint(main)
db_path = os.path.join(os.path.dirname(__file__), app.config["DATABASE_PATH"])
db_uri = 'sqlite:///{}'.format(db_path)

csrf = CsrfProtect()
csrf.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "main.login"


@login_manager.user_loader
def load_user(user_id):
    return g.db.query(User).get(int(user_id))

app.login_manager = None


@app.before_first_request
def init_app():
    init_db(create=False)
    g.db.query(User).delete()
    password = generate_password_hash(app.config["PASSWORD"])
    user = User(app.config["USER_NAME"], password)
    g.db.add(user)
    g.db.commit()
    g.user = current_user
    if app.login_manager is None:
        app.login_manager = login_manager
        app.login_manager.init_app(app)


@app.before_request
def init_db(create=False):
    engine = create_engine(db_uri)
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
