from flask import render_template, Blueprint, request, Response
from werkzeug.exceptions import BadRequest, NotFound
from smoke_signal.database import helpers
import json
import sqlalchemy.orm.exc

feed_view = Blueprint("feed_view", __name__,
                      template_folder="templates")


@feed_view.route('/')
def show_feeds_with_react():
    feeds = helpers.feed_list()
    return render_template('show_with_react.html', feeds=feeds)


@feed_view.route('/get_feed_list')
def get_feed_list():
    feeds = helpers.feed_list()
    js = json.dumps([feed.serialize() for feed in feeds])
    resp = Response(js, status=200, mimetype='application/json')
    resp.headers['Link'] = request.url
    return resp


@feed_view.route('/get_feed/<int:feed_id>')
def get_feed(feed_id):
    entries = helpers.refresh_feed(feed_id)
    js = json.dumps([entry.serialize() for entry in entries])
    resp = Response(js, status=200, mimetype='application/json')
    resp.headers['Link'] = request.url
    return resp


@feed_view.route('/add_feed', methods=['POST'])
def add_feed():
    try:
        added_feed = helpers.add_feed(request.form['url'])
        return json.dumps(added_feed.serialize())
    except KeyError:
        raise BadRequest


@feed_view.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

# Static stuff.


@feed_view.route('/static_page')
def show_feeds():
    feeds = helpers.feed_list()
    return render_template('show_feeds.html', feeds=feeds)


@feed_view.route('/feeds/<int:feed_id>')
def show_entries(feed_id):
    try:
        feeds = helpers.feed_list()
        feed = helpers.get_feed(feed_id)
        entries = helpers.get_feed_entries(feed_id)
        return render_template('show_feeds.html',
                               feed=feed, feeds=feeds, entries=entries)
    # Not sure if this could be better handled elsewhere.
    except sqlalchemy.orm.exc.NoResultFound as e:
        raise NotFound


@feed_view.route('/refresh/<feed_id>')
def refresh(feed_id):
    feeds = helpers.feed_list()
    feed = helpers.get_feed(feed_id)
    entries = helpers.refresh_feed(feed)
    return render_template('show_feeds.html',
                           feed=feed, feeds=feeds, entries=entries)
