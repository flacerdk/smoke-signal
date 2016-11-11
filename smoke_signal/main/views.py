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
    else:
        if not request.is_json:
            raise BadRequest
        try:
            return methods.post_feed(request.get_json()["url"])
        except KeyError:
            raise BadRequest


@main.route('/feeds/<int:feed_id>', methods=['GET'])
def refresh_feed(feed_id):
    return methods.refresh_feed(feed_id)


@main.route('/feeds/<int:feed_id>/<int:entry_id>', methods=['POST'])
def change_entry_status(feed_id, entry_id):
    if not request.is_json:
        raise BadRequest
    try:
        new_read_status = request.get_json()["read"]
        return methods.toggle_read_status(feed_id, entry_id,
                                          read=new_read_status)
    except KeyError:
        raise BadRequest


@main.route('/feeds/<int:feed_id>/read', methods=['GET'])
def all_read_entries_from_feed(feed_id):
    return methods.get_entries(feed_id, read=True)


@main.route('/feeds/<int:feed_id>/unread', methods=['GET'])
def unread_entries_from_feed(feed_id):
    return methods.get_entries(feed_id, read=False)
