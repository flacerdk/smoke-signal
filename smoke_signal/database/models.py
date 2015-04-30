from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Feed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    entries = db.relationship('Entry', backref='feed', lazy='dynamic')

    def __init__(self, title, url):
        self.title = title
        self.url = url

    def __unicode__(self):
        return u'<title {}>'.format(self.title)

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    guid = db.Column(db.String, nullable=False)
    text = db.Column(db.String, nullable=False)
    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'))

    def __init__(self, title, guid, text, feed_id):
        self.title = title
        self.guid = guid
        self.text = text
        self.feed_id = feed_id

    def __unicode__(self):
        return u'<title {}, text {}>'.format(self.title, self.text)

    def serialize(self):
        return {'title': self.title, 'text': self.text}
