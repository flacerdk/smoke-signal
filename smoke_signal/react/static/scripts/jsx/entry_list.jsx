import React from 'react';
import { getRequest } from './ajax_wrapper.js';

var EntryList = React.createClass({
  getInitialState: function() {
    return { entries: [] };
  },

  componentWillReceiveProps: function(nextProps) {
    getRequest('/feeds/' + nextProps.params.id, function(entries) {
      this.setState({entries: entries});
    }.bind(this));
  },

  render: function() {
    var entries = this.state.entries.map(function(entry) {
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
