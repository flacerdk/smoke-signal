import React from 'react'
import AddFeedForm from './AddFeedForm'
import FeedList from './FeedList'
import EntryList from './EntryList'
import FeedStore from '../stores/FeedStore'
import EntryStore from '../stores/EntryStore'

const getStateFromStores = () => ({
  feeds: FeedStore.feeds,
  entries: EntryStore.entries,
  activeEntryIndex: EntryStore.activeEntryIndex,
  activeFeedId: EntryStore.activeFeedId,
})

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
        <EntryList
          entries={this.state.entries}
          activeFeedId={this.state.activeFeedId}
          activeEntryIndex={this.state.activeEntryIndex}
        />
      </div>
    )
  }
}
