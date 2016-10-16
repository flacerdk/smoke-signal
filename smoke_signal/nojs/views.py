from flask import render_template, Blueprint
from werkzeug.exceptions import NotFound
from smoke_signal.database import helpers
from sqlalchemy.orm.exc import NoResultFound

nojs = Blueprint("nojs", __name__,
                 template_folder="templates",
                 static_folder="static",
                 static_url_path="/nojs/static")


@nojs.route('/static_page')
def show_feeds():
    feeds = helpers.feed_list()
    return render_template('show_feeds.html', feeds=feeds)


@nojs.route('/feeds/<int:feed_id>')
def show_entries(feed_id):
    try:
        feeds = helpers.feed_list()
        feed = helpers.get_feed(feed_id)
        entries = helpers.get_feed_entries(feed_id)
        return render_template('show_feeds.html',
                               feed=feed, feeds=feeds, entries=entries)
    except NoResultFound:
        raise NotFound


@nojs.route('/refresh/<feed_id>')
def refresh(feed_id):
    feeds = helpers.feed_list()
    feed = helpers.get_feed(feed_id)
    entries = helpers.refresh_feed(feed_id)
    return render_template('show_feeds.html',
                           feed=feed, feeds=feeds, entries=entries)
