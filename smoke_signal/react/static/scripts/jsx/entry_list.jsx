import React from 'react';

var EntryList = React.createClass({
    render: function() {
        var entries = this.props.entries.map(function(entry) {
            return (
                <div className="entry" key={entry.entry_id}>
                    <a href={entry.url}>{entry.title}</a>
                    <p>{entry.text}</p>
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
