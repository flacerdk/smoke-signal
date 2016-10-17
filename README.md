# smoke-signal

A simple web-based RSS reader.

## Setup

`smoke-signal` requires sqlite, Python 3 and the JavaScript libraries babel,
react and react-dom. Install the Python dependencies with `pip install -r
requirements.txt`. If you have npm, you can install the JavaScript dependencies
with `npm install`.

Create a configuration file in `instance/config.py`. At the moment no special
configuration is necessary, so you can just do `mkdir instance && cp config.py
instance/`.

You can run the `opml_import.py` script on an OPML file to import a list of
feeds. There's a sample at `sample.opml`.

## TODO

The reader is very simple as of now; at the moment, my priority is to get it
decent enough that I'll be willing to use it instead of The Old Reader.

Later, I want to add some extensibility: the ability to add your own script to
fetch a feed, à la Liferea. Surprisingly, there are still websites that don't
have an RSS feed in 2016.

In the long run, my plan is to decouple client and server, so that Flask will
just store and serve the feeds, while React will do the heavy lifting. I believe
this won't be too challenging, as React already does most of the presentation
work.
