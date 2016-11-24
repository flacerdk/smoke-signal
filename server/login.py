from flask import g
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired
from werkzeug.security import check_password_hash

from server.database.models import User


class LoginForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        FlaskForm.__init__(self, *args, **kwargs)
        self.user = None
        self.error = None

    def validate(self):
        form_validated = FlaskForm.validate(self)
        if not form_validated:
            return False

        user = g.db.query(User).filter(User.name == self.name.data).one()
        if check_password_hash(user.password, self.password.data):
            self.user = user
            return True
        self.error = "Wrong name or password"
        return False
