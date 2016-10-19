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
        return add_feed()
    else:
        feeds = helpers.feed_list()
        resp = helpers.jsonify(feeds)
        return resp


@react.route('/feeds/<int:feed_id>', methods=['GET'])
def get_feed(feed_id):
    entries = helpers.refresh_feed(feed_id)
    resp = helpers.jsonify(entries)
    return resp


def add_feed():
    try:
        added_feed = helpers.add_feed(request.form['url'])
        resp = helpers.jsonify(added_feed)
        resp.headers['Location'] = '/feeds/{}'.format(
            added_feed.serialize()['id'])
        return resp
    except KeyError:
        raise BadRequest
