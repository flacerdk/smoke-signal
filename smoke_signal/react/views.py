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
        resp = helpers.feed_list()
        return resp


@react.route('/feeds/<int:feed_id>', methods=['GET'])
def get_feed(feed_id):
    return helpers.refresh_feed(feed_id)


def add_feed():
    try:
        resp = helpers.add_feed(request.form['url'])
        return resp
    except KeyError:
        raise BadRequest
