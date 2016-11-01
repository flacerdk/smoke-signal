import React from 'react'
import FeedReaderActions from '../actions/feed_reader_actions.js'

export default class FeedList extends React.Component {
  handleFeedClicked(feedId) {
    FeedReaderActions.fetchFeedEntries(feedId)
  }

  render() {
    const feeds = this.props.feeds.map(feed => {
      const link = "#/feeds/" + feed.id;
      let onClick = this.handleFeedClicked.bind(null, feed.id);
      return (
        <li className="feed" key={feed.id}>
          <a className="feed" href={link} onClick={onClick}>{feed.title}</a>
        </li>
      );
    });

    return (
      <div id="feeds">
        <ul className="feed_list">{feeds}</ul>
      </div>
    );
  }
}

FeedList.propTypes = {
  feeds: React.PropTypes.array,
}
