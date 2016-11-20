# smoke-signal

A simple web-based RSS reader.

## Setup

`smoke-signal` requires sqlite, Python 3 and the JavaScript libraries listed in
`package.json` under "dependencies". Install the Python dependencies with `pip
install -r requirements.txt`. If you have npm, you can install the JavaScript
dependencies with `npm install`.

Create a configuration file in `instance/config.py`; the file `config.py` in the
root directory can serve as a starting point. Note that you have to fill in a
username and password, which will be used as your login credentials.

You can run `python -m utils.opml_import` script on an OPML file to import a
list of feeds. There's a sample at `sample.opml`.

Finally, run `webpack -p` to bundle the JavaScript code and `python run.py` to
run the server.

## Key shortcuts

Use `j` and `k` to scroll down/up entries, `m` to toggle an entry as read, `r`
to refresh the feed, and `g r` to refresh all feeds. (Warning: the last one is
pretty slow at the moment.)

## Tests

Tests can be run with `python -m unittest discover -t . -s tests -v`.

## TODO

The reader is very simple as of now; at the moment, my priority is to get it
decent enough that I'll be willing to use it instead of The Old Reader. Most
importantly, the interface is still very ugly, as I've focused on getting all
the components working. Also, refreshing all feeds is very slow; I plan on
fixing that soon.

Later, I want to add some extensibility: the ability to add your own script to
fetch a feed, à la Liferea. Surprisingly, there are still websites that don't
have an RSS feed in 2016.

Although at the moment the Python code (under `smoke_signal/`) and the
JavaScript code (under `js/`) are in the same project, the two are completely
decoupled, other than Flask serves some HTML. I'm likely to split the code into
different projects in the future, which will make a possible migration to Node
easier.
