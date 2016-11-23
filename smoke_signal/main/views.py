from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import login_required, login_user
from werkzeug.exceptions import BadRequest
from smoke_signal.main import methods
from smoke_signal.login import LoginForm

main = Blueprint("main", __name__,
                 template_folder="templates",
                 static_folder="static",
                 static_url_path="/main/static")


@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        login_user(form.user)
        next_ = request.args.get("next")
        return redirect(next_ or url_for("main.index"))
    return render_template("login.html", form=form, error=form.error)


@main.route('/')
@login_required
def index():
    feeds = methods.get_all_feeds()
    return render_template('main.html', feeds=feeds)


@main.route('/feeds/', methods=['GET', 'POST'])
@login_required
def all_feeds():
    if request.method == 'GET':
        return methods.get_all_feeds()
    if not request.is_json:
        raise BadRequest
    try:
        return methods.post_feed(request.get_json()["url"])
    except KeyError:
        raise BadRequest


@main.route('/feeds/<int:feed_id>', methods=['GET', 'POST'])
@login_required
def feed(feed_id):
    if request.method == 'GET':
        return all_feed_entries(feed_id, "all")
    return methods.refresh_feed(feed_id)


@main.route('/feeds/<int:feed_id>/<predicate>', methods=['GET'])
@login_required
def all_feed_entries(feed_id, predicate):
    if predicate not in ["all", "read", "unread", "marked"]:
        raise BadRequest
    return methods.get_entries(predicate=predicate, feed_id=feed_id)


@main.route('/feeds/<predicate>', methods=['GET'])
@login_required
def all_entries(predicate):
    return methods.get_entries(predicate=predicate)


@main.route('/feeds/all', methods=['POST'])
@login_required
def mark_all_read():
    if not request.is_json or "read" not in request.get_json():
        raise BadRequest
    if request.get_json()["read"]:
        return methods.mark_all_read()
    else:
        return '', 204


@main.route('/feeds/<int:feed_id>/<int:entry_id>', methods=['GET', 'POST'])
@login_required
def entry(feed_id, entry_id):
    if request.method == 'GET':
        return methods.get_entry(feed_id, entry_id)
    if not request.is_json:
        raise BadRequest
    data = request.get_json()
    if "read" in data or "marked" in data:
        return methods.toggle_status(feed_id, entry_id,
                                     data)
    raise BadRequest
