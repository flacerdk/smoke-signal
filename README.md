# smoke-signal

A simple web-based RSS reader.

## Setup

`smoke-signal` requires Python 3 and the JavaScript libraries babel, jquery,
react and react-dom. Install the Python dependencies with `pip install -r
requirements.txt`. If you have npm, you can install the JavaScript dependencies
with `npm install`.

Currently it's not possible to add feeds, so before running the server, run the
`opml_import.py` script on an OPML file to import a list of feeds. There's a
sample at `sample.opml`.

## TODO

The reader is very simple as of now; at the moment, my priority is to get it
decent enough that I'll be willing to use it instead of The Old Reader. As
noted, it's not possible to add feeds yet, so that's likely to be the next step.

Later, I want to add some extensibility: the ability to add your own script to
fetch a feed, à la Liferea. Surprisingly, there are still websites that don't
have an RSS feed in 2016.
