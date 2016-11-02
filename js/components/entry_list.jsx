import React from 'react'
import Mousetrap from 'mousetrap'
import Entry from './entry.jsx'
import FeedReaderActions from '../actions/feed_reader_actions'

export default class EntryList extends React.Component {
  constructor() {
    super()

    this._getEntryId = this._getEntryId.bind(this)
  }

  componentDidMount() {
    Mousetrap.bind('j', () => FeedReaderActions.scroll(1))
    Mousetrap.bind('k', () => FeedReaderActions.scroll(-1))
    Mousetrap.bind('m', () =>
      FeedReaderActions.markEntryAsRead(this.props.activeFeedId,
      this._getEntryId(this.props.activeEntryIndex)))
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('m')
  }

  _getEntryId(index) {
    return this.props.entries[index].entry_id
  }

  render() {
    const entries = this.props.entries.map((entry, index) => {
      if (index >= this.props.activeEntryIndex) {
        return (
          <Entry
              title={entry.title}
              url={entry.url}
              text={entry.text}
              key={entry.entry_id} />
        )
      }
    })
    return (
      <div id="entries">
        {entries}
      </div>
    )
  }
}

EntryList.propTypes = {
  entries: React.PropTypes.array,
  activeEntryIndex: React.PropTypes.number,
  activeFeedId: React.PropTypes.number
}

EntryList.defaultProps = {
  entries: [],
  activeEntryIndex: 0,
  activeFeedId: 0
}
