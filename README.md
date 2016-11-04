# smoke-signal

A simple web-based RSS reader.

## Setup

`smoke-signal` requires sqlite, Python 3 and the JavaScript libraries listed in
`package.json` under "dependencies". Install the Python dependencies with `pip
install -r requirements.txt`. If you have npm, you can install the JavaScript
dependencies with `npm install`.

Create a configuration file in `instance/config.py`. At the moment no special
configuration is necessary, so you can just do `mkdir instance && cp config.py
instance/`.

You can run `python -m utils.opml_import` script on an OPML file to import a
list of feeds. There's a sample at `sample.opml`.

Finally, run `webpack -p` to bundle the JavaScript code and `python run.py` to
run the server.

## Tests

Tests can be run with `python -m tests.test_server_methods`.

## TODO

The reader is very simple as of now; at the moment, my priority is to get it
decent enough that I'll be willing to use it instead of The Old Reader.

Later, I want to add some extensibility: the ability to add your own script to
fetch a feed, à la Liferea. Surprisingly, there are still websites that don't
have an RSS feed in 2016.

Although at the moment the Python code (under `smoke_signal/`) and the
JavaScript code (under `js/`) are in the same project, the two are completely
decoupled, other than Flask serves some HTML. I'm likely to split the code into
different projects in the future, which will make a possible migration to Node easier.
