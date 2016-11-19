from flask import render_template, Blueprint, request
from werkzeug.exceptions import BadRequest
from smoke_signal.main import methods

main = Blueprint("main", __name__,
                 template_folder="templates",
                 static_folder="static",
                 static_url_path="/main/static")


@main.route('/')
def feeds():
    feeds = methods.get_all_feeds()
    return render_template('main.html', feeds=feeds)


@main.route('/feeds/', methods=['GET', 'POST'])
def feed_list():
    if request.method == 'GET':
        return methods.get_all_feeds()
    if not request.is_json:
        raise BadRequest
    try:
        return methods.post_feed(request.get_json()["url"])
    except KeyError:
        raise BadRequest


@main.route('/feeds/<int:feed_id>', methods=['GET', 'POST'])
def refresh_feed(feed_id):
    if request.method == 'GET':
        return load_feed(feed_id, "all")
    return methods.refresh_feed(feed_id)


@main.route('/feeds/<int:feed_id>/<predicate>', methods=['GET'])
def load_feed(feed_id, predicate):
    if predicate not in ["all", "read", "unread", "marked"]:
        raise BadRequest
    return methods.get_entries(predicate=predicate, feed_id=feed_id)


@main.route('/feeds/<predicate>', methods=['GET'])
def all_read_entries(predicate):
    return methods.get_entries(predicate=predicate)


@main.route('/feeds/<int:feed_id>/<int:entry_id>', methods=['GET', 'POST'])
def change_entry_status(feed_id, entry_id):
    if request.method == 'GET':
        return methods.get_entry(feed_id, entry_id)
    if not request.is_json:
        raise BadRequest
    data = request.get_json()
    return methods.toggle_status(feed_id, entry_id,
                                 data)
