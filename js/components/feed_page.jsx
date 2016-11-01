import React from 'react'
import AddFeedForm from './add_feed_form.jsx'
import FeedList from './feed_list.jsx'
import EntryList from './entry_list.jsx'
import { getRequest, postJSONRequest } from '../utils/ajax_wrapper.js'

export default class FeedPage extends React.Component {
  constructor() {
    super();

    this.state = {
      feeds: [],
      entries: []
    }

    this.handleFeedListRefresh = this.handleFeedListRefresh.bind(this);
    this.handleAddFeed = this.handleAddFeed.bind(this);
    this.handleFeedClicked = this.handleFeedClicked.bind(this);
  }

  componentDidMount() {
    this.handleFeedListRefresh();
  }

  handleAddFeed(url) {
    postJSONRequest("/feeds/", {"url": url})
      .then(feed => {
        const newFeeds = this.state.feeds.concat([feed]);
        this.setState({feeds: newFeeds});
      })
      .catch(ex => console.log("Couldn't add feed: " + ex.message));
  }

  handleFeedListRefresh() {
    getRequest("/feeds/")
      .then(feeds => this.setState({feeds: feeds}))
      .catch(ex => console.log("Couldn't load feed list: " + ex.message));
  }

  handleFeedClicked(feed_id) {
    getRequest('/feeds/' + feed_id)
      .then(entries => this.setState({entries: entries}))
      .catch(ex => console.log("Couldn't load feed: " + ex.message));
  }

  render() {
    return (
      <div id="feed_page">
        <AddFeedForm onSubmit={this.handleAddFeed}/>
        <FeedList feeds={this.state.feeds} onClick={this.handleFeedClicked} />
        <EntryList entries={this.state.entries} />
      </div>
    );
  }
}


