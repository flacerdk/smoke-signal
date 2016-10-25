import React from 'react';
import { getRequest, postJSONRequest } from './ajax_wrapper.js';
import { Link } from 'react-router';
import { Events } from './event_system.js';

export default class FeedList extends React.Component {
  constructor() {
    super();

    this.state = {
      feeds: [],
      eventId: 0,
    }

    this.handleFeedListRefresh = this.handleFeedListRefresh.bind(this);
    this.handleAddFeed = this.handleAddFeed.bind(this);
  }

  handleFeedListRefresh() {
    getRequest("/feeds/", (feeds => {
      this.setState({feeds: feeds});
    }).bind(this));
  }

  componentDidMount() {
    this.handleFeedListRefresh();
    const id = Events.subscribe("add_feed", this.handleAddFeed);
    this.setState({eventId: id});
  }

  componentWillUnmount() {
    Events.unsubscribe(eventId);
  }

  handleAddFeed(event) {
    postJSONRequest('/feeds/', {'url': event.url}, (feed => {
      const newFeeds = this.state.feeds.concat([feed]);
      this.setState({feeds: newFeeds});
    }).bind(this));
  }

  render() {
    const feeds = this.state.feeds.map(feed => {
      const link = "/feeds/" + feed.id;
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
  }
}
