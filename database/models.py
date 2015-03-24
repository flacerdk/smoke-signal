from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Feed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    entries = db.relationship('Entry', backref='feed', lazy='dynamic')

    def __init__(self, title):
        self.title = title

    def __repr__(self):
        return '<title {}>'.format(self.body)

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    text = db.Column(db.String, nullable=False)
    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'))

    def __init__(self, title, text):
        self.title = title
        self.text = text

    def __repr__(self):
        return '<title {}>'.format(self.body)
