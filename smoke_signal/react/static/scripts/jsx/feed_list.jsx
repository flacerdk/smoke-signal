import React from 'react';

export default class FeedList extends React.Component {
  render() {
    const feeds = this.props.feeds.map(feed => {
      const link = "#/feeds/" + feed.id;
      let onClick = this.props.onClick.bind(null, feed.id);
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
