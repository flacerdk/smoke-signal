from smoke_signal import app
from smoke_signal.views import feed_view

app.register_blueprint(feed_view)
app.run(debug=True)
