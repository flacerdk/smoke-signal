# smoke-signal

A simple web-based RSS reader.

Try the [demo](https://flacer.dk/smoke_signal/), with username
`userusernamename` and password `wordpass`.

## Setup

`smoke-signal` requires sqlite, Python 3, lxml and the JavaScript libraries
listed in `package.json` under "dependencies". Install the Python dependencies
with `pip install -r requirements.txt`. If you have npm, you can install the
JavaScript dependencies with `npm install`.

Create a configuration file in `instance/config.py`; the file `config.py` in the
root directory can serve as a starting point. Note that you have to fill in a
username and password, which will be used as your login credentials, as well as
a secret key which will be used for CSRF protection.

You can run `python -m utils.opml_import` script on an OPML file to import a
list of feeds.

Finally, run `webpack -p` to bundle the JavaScript code and `python run.py` to
run the server.

## Key shortcuts

Use `j` and `k` to scroll down/up entries, `m` to toggle an entry as read, `g m`
to mark all entries as read, `r` to refresh the feed, and `g r` to refresh all
feeds. (Warning: the last one is pretty slow at the moment.)

## Tests

Tests can be run with `python -m unittest discover -t . -s tests -v`.

## Issues

There are many features to be added, such as search, and being able to add a
feed by handing the home page's URL to the server and making it look for the
feed. These features are likely not hard to implement, but for now I'm focusing
on fixing eventual bugs in the existing features.

In particular, the JavaScript code could use more tests. It could also give the
user better feedback when something wrong (which I expect to usually be a
network-related problem) happens.

Later, I want to add some extensibility: the ability to add your own script to
fetch a feed, à la Liferea. Surprisingly, there are still websites that don't
have an RSS feed in 2016. Also, there's a lot of room for improvement in
styling; Bootstrap has been of great help there and it's probably not hard to
build it up from it. 

Although at the moment the Python code (under `server/`) and the
JavaScript code (under `js/`) are in the same project, the two are completely
decoupled, other than Flask serves some HTML. I'm likely to split the code into
different projects in the future, which will make a possible migration to Node
easier.
