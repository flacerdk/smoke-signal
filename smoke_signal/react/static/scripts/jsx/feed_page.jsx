import React from 'react';
import ReactDOM from 'react-dom';
import AddFeedForm from './add_feed_form.jsx';
import FeedList from './feed_list.jsx';
import EntryList from './entry_list.jsx';
import { getRequest, postRequest } from './ajax_wrapper.js';

var FeedPage = React.createClass({
  getInitialState: function() {
    return { feeds: [], entries: [] };
  },

  handleFeedListRefresh: function() {
    getRequest(this.props.url, function(feeds) {
      this.setState({feeds: feeds});
    }.bind(this));
  },

  handleFeedRefresh: function(feed) {
    getRequest('/feeds/' + feed.id, function(entries) {
      this.setState({entries: entries});
    }.bind(this));
  },

  handleAddFeed: function(url) {
    postRequest('/feeds', url, function(feed) {
      var newFeeds = this.state.feeds.concat([feed]);
      this.setState({feeds: newFeeds});
    }.bind(this));
  },

  componentDidMount: function() {
    this.handleFeedListRefresh();
  },

  render: function() {
    var feed_list;
    if (this.state.feeds.length === 0) {
      feed_list = <i>Add a feed!</i>
    } else {
      feed_list = <FeedList feeds={this.state.feeds} onClick={this.handleFeedRefresh} />
    };
    return (
      <div id="feed_page">
        <AddFeedForm onAddFeed={this.handleAddFeed} />
        {feed_list}
        <EntryList entries={this.state.entries} />
      </div>
    );
  }

});

ReactDOM.render(
  <FeedPage url="/feeds" />,
  document.getElementById('container')
);
