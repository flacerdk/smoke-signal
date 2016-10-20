import React from 'react';
import { getRequest, postRequest } from './ajax_wrapper.js';
import { Link } from 'react-router';

var FeedList = React.createClass({
  getInitialState: function() {
    return { feeds: [] };
  },

  handleFeedListRefresh: function() {
    getRequest("/feeds/", function(feeds) {
      this.setState({feeds: feeds});
    }.bind(this));
  },

  componentDidMount: function() {
    this.handleFeedListRefresh();
  },

  handleAddFeed: function(url) {
    postRequest('/feeds', url, function(feed) {
      var newFeeds = this.state.feeds.concat([feed]);
      this.setState({feeds: newFeeds});
    }.bind(this));
  },

  render: function() {
    var feeds = this.state.feeds.map(function(feed) {
      var link = "/feeds/" + feed.id;
      return (
        <li className="feed" key={feed.id}>
          <Link className="feed" to={link}>{feed.title}</Link>
        </li>
      );
    });
    return (
      <div id="feeds">
        <ul className="feed_list">{feeds}</ul>
        {this.props.children}
      </div>
    );
  },
});

module.exports = FeedList;
