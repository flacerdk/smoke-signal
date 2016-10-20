import React from 'react';
import EntryList from './entry_list.jsx';
import { getRequest } from './ajax_wrapper.js';

var FeedList = React.createClass({
  getInitialState: function() {
    return { entries: [] };
  },

  handleFeedRefresh: function(feed) {
    getRequest('/feeds/' + feed.id, function(entries) {
      this.setState({entries: entries});
    }.bind(this));
  },

  render: function() {
    var onClick = this.handleFeedRefresh;
    var feeds = this.props.feeds.map(function(feed) {
      return (
        <li className="feed" onClick={onClick.bind(null, feed)} key={feed.id}>
          <a className="feed" href="#">{feed.title}</a>
        </li>
      );
    });
    return (
      <div id="feeds">
        <ul className="feed_list">{feeds}</ul>
        <EntryList entries={this.state.entries} />
      </div>
    );
  },
});

module.exports = FeedList;
