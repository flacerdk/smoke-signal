import React from 'react';

var EntryList = React.createClass({
    render: function() {
        var entries = this.props.entries.map(function(entry) {
            // Trusting that feedparser does proper sanitization here
            function createMarkup() { return { __html: entry.text } };
            return (
                <div className="entry" key={entry.entry_id}>
                    <a className="entry_title" href={entry.url}>{entry.title}</a>
                    <div dangerouslySetInnerHTML={createMarkup()} />
                </div>
            );
        });
        return (
            <div id="entries">
                {entries}
            </div>
        );
    }
});

module.exports = EntryList;
