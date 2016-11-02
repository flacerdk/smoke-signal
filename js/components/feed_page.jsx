import React from 'react'
import AddFeedForm from './add_feed_form'
import FeedList from './feed_list'
import EntryList from './entry_list'
import FeedStore from '../stores/FeedStore'
import EntryStore from '../stores/EntryStore'

let getStateFromStores = () => {
  return {
    feeds: FeedStore.feeds,
    entries: EntryStore.entries,
    activeEntryIndex: EntryStore.activeEntryIndex,
    activeFeedId: EntryStore.activeFeedId
  }
}

export default class FeedPage extends React.Component {
  constructor() {
    super()

    this.state = getStateFromStores()
    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    FeedStore.addChangeListener(this._onChange)
    EntryStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    FeedStore.removeChangeListener(this._onChange)
    EntryStore.removeChangeListener(this._onChange)
  }

  _onChange() {
    this.setState(getStateFromStores())
  }

  render() {
    return (
      <div id="feed_page">
        <AddFeedForm />
        <FeedList feeds={this.state.feeds} />
        <EntryList entries={this.state.entries}
                   activeFeedId={this.state.activeFeedId}
                   activeEntryIndex={this.state.activeEntryIndex} />
      </div>
    )
  }
}
