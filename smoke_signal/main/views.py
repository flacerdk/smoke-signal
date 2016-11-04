from flask import render_template, Blueprint, request
from werkzeug.exceptions import BadRequest
from smoke_signal.database import helpers

main = Blueprint("main", __name__,
                 template_folder="templates",
                 static_folder="static",
                 static_url_path="/main/static")


@main.route('/')
def feeds():
    feeds = helpers.feed_list()
    return render_template('main.html', feeds=feeds)


@main.route('/feeds/', methods=['GET', 'POST'])
def feed_list():
    if request.method == 'POST':
        return add_feed(request)
    else:
        resp = helpers.feed_list()
        return resp


@main.route('/feeds/<int:feed_id>', methods=['GET'])
def refresh_feed(feed_id):
    return helpers.refresh_feed(feed_id)


# Assumes request is sending JSON data with a "url" entry. Returns 400
# otherwise
def add_feed(request):
    if not request.is_json:
        raise BadRequest
    try:
        resp = helpers.add_feed(request.get_json()["url"])
        return resp
    except KeyError:
        raise BadRequest


@main.route('/feeds/<int:feed_id>/<int:entry_id>', methods=['POST'])
def change_entry_status(feed_id, entry_id):
    if not request.is_json:
        raise BadRequest
    try:
        new_read_status = request.get_json()["read"]
        return helpers.toggle_entry_read_status(feed_id, entry_id,
                                                read=new_read_status)
    except KeyError:
        raise BadRequest


@main.route('/feeds/<int:feed_id>/read', methods=['GET'])
def all_read_entries_from_feed(feed_id):
    return helpers.get_entries(feed_id=feed_id, read=True)


@main.route('/feeds/<int:feed_id>/unread', methods=['GET'])
def unread_entries_from_feed(feed_id):
    return helpers.get_entries(feed_id=feed_id, read=False)
