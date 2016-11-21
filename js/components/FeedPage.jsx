import React from 'react'
import Mousetrap from 'mousetrap'
import AddFeedForm from './AddFeedForm'
import Sidebar from './Sidebar'
import EntryList from './EntryList'
import FeedStore from '../stores/FeedStore'
import EntryStore from '../stores/EntryStore'
import FeedReaderActions from '../actions/FeedReaderActions'

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
    Mousetrap.bind('g r', () => {
      FeedReaderActions.refreshAllFeeds()
    })
    Mousetrap.bind('r', () => {
      FeedReaderActions.refreshFeed(this.state.activeFeedId)
    })
  }

  componentWillUnmount() {
    this._feedStore.removeChangeListener(this._onChange)
    this._entryStore.removeChangeListener(this._onChange)
    Mousetrap.unbind('g r')
  }

  getStateFromStores() {
    return {
      feeds: this._feedStore.feeds,
      entries: this._entryStore.entries,
      activeEntry: this._entryStore.activeEntry,
      activeFeedId: this._feedStore.activeFeedId,
    }
  }

  _onChange() {
    this.setState(this.getStateFromStores())
  }

  render() {
    return (
      <div id="feed_page">
        <AddFeedForm />
        <Sidebar feeds={this.state.feeds} />
        <EntryList
          entries={this.state.entries}
          activeEntry={this.state.activeEntry}
        />
      </div>
    )
  }
}
