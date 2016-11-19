import sqlalchemy as sql
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from time import mktime

Base = declarative_base()


class Feed(Base):
    __tablename__ = "feed"

    id = sql.Column(sql.Integer, primary_key=True)
    title = sql.Column(sql.String, nullable=False)
    url = sql.Column(sql.String, nullable=False)
    entries = relationship('Entry', backref='feed', lazy='dynamic')

    def __init__(self, title, url):
        self.title = title
        self.url = url

    def __unicode__(self):
        return '<title {}, url {}>'.format(self.title, self.url)

    def serialize(self):
        return {'id': self.id, 'title': self.title, 'url': self.url}


class Entry(Base):
    __tablename__ = "entry"

    id = sql.Column(sql.Integer, primary_key=True)
    title = sql.Column(sql.String, nullable=False)
    guid = sql.Column(sql.String, nullable=False)
    text = sql.Column(sql.String, nullable=False)
    url = sql.Column(sql.String, nullable=False)
    read = sql.Column(sql.Boolean, nullable=False)
    marked = sql.Column(sql.Boolean, nullable=False)
    pub_date = sql.Column(sql.DateTime, nullable=False)
    feed_id = sql.Column(sql.Integer, sql.ForeignKey('feed.id'))

    def __init__(self, title, guid, url, text, feed_id, pub_date=None):
        self.title = title
        self.guid = guid
        self.text = text
        self.url = url
        self.read = False
        self.marked = False
        if pub_date is None:
            self.pub_date = datetime.fromtimestamp(0)
        else:
            self.pub_date = datetime.fromtimestamp(mktime(pub_date))
        self.feed_id = feed_id

    def __unicode__(self):
        return '<title {}, text {}>'.format(self.title, self.text)

    def serialize(self):
        return {'title': self.title, 'text': self.text,
                'url': self.url, 'id': self.id,
                'feed_id': self.feed_id, 'read': self.read,
                'marked': self.marked,
                'pub_date': self.pub_date.isoformat()}
