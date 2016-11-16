import React from 'react'
import AddFeedForm from './AddFeedForm'
import FeedList from './FeedList'
import EntryList from './EntryList'
import FeedStore from '../stores/FeedStore'
import EntryStore from '../stores/EntryStore'

export default class FeedPage extends React.Component {
  constructor() {
    super()

    this._feedStore = new FeedStore()
    this._entryStore = new EntryStore()

    this.getStateFromStores = this.getStateFromStores.bind(this)
    this.state = this.getStateFromStores()
    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    this._feedStore.addChangeListener(this._onChange)
    this._entryStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    this._feedStore.removeChangeListener(this._onChange)
    this._entryStore.removeChangeListener(this._onChange)
  }

  getStateFromStores() {
    return {
      feeds: this._feedStore.feeds,
      entries: this._entryStore.entries,
      activeEntryIndex: this._entryStore.activeEntryIndex,
      activeFeedId: this._entryStore.activeFeedId,
    }
  }

  _onChange() {
    this.setState(this.getStateFromStores())
  }

  render() {
    return (
      <div id="feed_page">
        <AddFeedForm />
        <FeedList feeds={this.state.feeds} />
        <EntryList
          entries={this.state.entries}
          activeFeedId={this.state.activeFeedId}
          activeEntryIndex={this.state.activeEntryIndex}
        />
      </div>
    )
  }
}
