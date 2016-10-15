from flask import render_template, g, Blueprint, request, Response
from smoke_signal.database.models import Feed, Entry
from smoke_signal.parse import parse_entries, parse_feed
import json
import sqlalchemy.orm.exc

feed_view = Blueprint("feed_view", __name__,
                      template_folder="templates")


@feed_view.route('/')
def show_feeds():
    feeds = g.db.query(Feed)
    return render_template('show_feeds.html', feeds=feeds)


@feed_view.route('/react')
def show_feeds_with_react():
    feeds = g.db.query(Feed)
    return render_template('show_with_react.html', feeds=feeds)


@feed_view.route('/get_feed_list')
def get_feed_list():
    feeds = g.db.query(Feed)
    js = json.dumps([feed.serialize() for feed in feeds])
    resp = Response(js, status=200, mimetype='application/json')
    resp.headers['Link'] = request.url
    return resp


@feed_view.route('/feeds/<int:feed_id>')
def show_entries(feed_id):
    try:
        feeds = g.db.query(Feed)
        feed = feeds.filter(Feed.id == feed_id).one()
        entries = g.db.query(Entry).filter(Entry.feed_id == feed_id).all()
        return render_template('show_feeds.html',
                               feed=feed, feeds=feeds, entries=entries)
    # Not sure if this could be better handled elsewhere.
    except sqlalchemy.orm.exc.NoResultFound as e:
        return page_not_found(e)


@feed_view.route('/get_feed/<int:feed_id>')
def get_feed(feed_id):
    try:
        refresh_feed(feed_id)
        entries = g.db.query(Entry).filter(Entry.feed_id == feed_id).all()
        js = json.dumps([entry.serialize() for entry in entries])
        resp = Response(js, status=200, mimetype='application/json')
        resp.headers['Link'] = request.url
        return resp
    except sqlalchemy.orm.exc.NoResultFound as e:
        return json.dumps({})


@feed_view.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404


@feed_view.route('/refresh/<feed_id>')
def refresh(feed_id):
    feeds = g.db.query(Feed)
    if feed_id == -1:
        return json.dumps({"error": "feed is invalid"})
    feed = feeds.filter(Feed.id == feed_id).one()
    try:
        entries = parse_feed(feed)
    except:
        return json.dumps({"error": "couldn't fetch feed"})
    add_entries(entries)
    return render_template('show_feeds.html',
                           feed=feed, feeds=feeds, entries=entries)


def refresh_feed(feed_id):
    feeds = g.db.query(Feed)
    if feed_id == -1:
        return json.dumps({"error": "feed is invalid"})
    feed = feeds.filter(Feed.id == feed_id).one()
    try:
        entries = parse_entries(feed)
    except:
        return json.dumps({"error": "couldn't fetch feed"})
    add_entries(entries)


def add_entries(entries):
    for e in entries:
        guid = e.guid
        query = g.db.query(Entry).filter(Entry.guid == guid)
        if query.all() == []:
            g.db.add(e)
    g.db.commit()


@feed_view.route('/add_feed', methods=['POST'])
def add_feed():
    if 'url' in request.form:
        try:
            feed = parse_feed(request.form['url'])
        except ValueError:
            return "No such feed", 404
        g.db.add(feed)
        g.db.commit()
        added_feed = g.db.query(Feed).filter(Feed.id == feed.id).one()
        return json.dumps(added_feed.serialize())
    else:
        return "Bad request", 400
