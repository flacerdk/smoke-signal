import React from 'react'
import AddFeedForm from './add_feed_form.jsx'
import FeedList from './feed_list.jsx'
import EntryList from './entry_list.jsx'
import FeedStore from '../stores/FeedStore.js'
import EntryStore from '../stores/EntryStore.js'

let getStateFromStores = () => {
  return {
    feeds: FeedStore.getAllFeeds(),
    entries: EntryStore.getAllEntries(),
    firstActiveEntry: EntryStore.getFirstActiveEntry()
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
        <EntryList entries={this.state.entries} firstActiveEntry={this.state.firstActiveEntry}/>
      </div>
    )
  }
}
