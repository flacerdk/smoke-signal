import React from 'react';

var EntryList = React.createClass({
    render: function() {
        var entries = this.props.entries.map(function(entry) {
            // Trusting that feedparser does proper sanitization here
            function createMarkup() { return { __html: entry.text } };
            return (
                <div className="entry" key={entry.entry_id}>
                    <a href={entry.url}>{entry.title}</a>
                    <div dangerouslySetInnerHTML={createMarkup()} />
                </div>
            );
        });
        return (
            <div className="entries">
                {entries}
            </div>
        );
    }
});

module.exports = EntryList;
