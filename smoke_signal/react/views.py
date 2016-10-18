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


@react.route('/get_feed_list')
def get_feed_list():
    feeds = helpers.feed_list()
    resp = helpers.jsonify(feeds, request.url)
    return resp


@react.route('/get_feed/<int:feed_id>')
def get_feed(feed_id):
    entries = helpers.refresh_feed(feed_id)
    resp = helpers.jsonify(entries, request.url)
    return resp


@react.route('/add_feed', methods=['POST'])
def add_feed():
    try:
        added_feed = helpers.add_feed(request.form['url'])
        return helpers.jsonify(added_feed, request.url)
    except KeyError:
        raise BadRequest
