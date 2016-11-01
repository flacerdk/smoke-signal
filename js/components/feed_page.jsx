import React from 'react'
import AddFeedForm from './add_feed_form.jsx'
import FeedList from './feed_list.jsx'
import EntryList from './entry_list.jsx'
import FeedStore from '../stores/FeedStore.js'

let getStateFromStores = () => {
  return {
    feeds: FeedStore.getAllFeeds(),
    entries: FeedStore.getActiveFeedEntries()
  }
}

export default class FeedPage extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStores();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    FeedStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    FeedStore.removeChangeListener(this._onChange)
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

  render() {
    return (
      <div id="feed_page">
        <AddFeedForm onSubmit={this.handleAddFeed}/>
        <FeedList feeds={this.state.feeds} />
        <EntryList entries={this.state.entries} />
      </div>
    );
  }
}


