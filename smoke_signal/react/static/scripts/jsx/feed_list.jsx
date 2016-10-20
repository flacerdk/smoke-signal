import React from 'react';

var FeedList = React.createClass({
  render: function() {
    var onClick = this.props.onClick;
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
      </div>
    );
  },
});

module.exports = FeedList;
