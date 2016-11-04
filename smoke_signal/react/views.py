from flask import render_template, Blueprint, request
from werkzeug.exceptions import BadRequest
from smoke_signal.database import helpers

react = Blueprint("react", __name__,
                  template_folder="templates",
                  static_folder="static",
                  static_url_path="/react/static")


@react.route('/')
def show_feeds_with_react():
    feeds = helpers.feed_list()
    return render_template('show_with_react.html', feeds=feeds)


@react.route('/feeds/', methods=['GET', 'POST'])
def get_feed_list():
    if request.method == 'POST':
        return add_feed(request)
    else:
        resp = helpers.feed_list()
        return resp


@react.route('/feeds/<int:feed_id>', methods=['GET'])
def get_feed(feed_id):
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


@react.route('/feeds/<int:feed_id>/<int:entry_id>', methods=['POST'])
def change_entry_status(feed_id, entry_id):
    if not request.is_json:
        raise BadRequest
    try:
        new_read_status = request.get_json()["read"]
        return helpers.toggle_entry_read_status(feed_id, entry_id,
                                                read=new_read_status)
    except KeyError:
        raise BadRequest


@react.route('/feeds/<int:feed_id>/read', methods=['GET'])
def get_read_entries(feed_id):
    return helpers.get_entries(feed_id=feed_id, read=True)


@react.route('/feeds/<int:feed_id>/unread', methods=['GET'])
def get_unread_entries(feed_id):
    return helpers.get_entries(feed_id=feed_id, read=False)
