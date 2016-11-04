import React from 'react'
import Mousetrap from 'mousetrap'
import Entry from './Entry'
import FeedReaderActions from '../actions/FeedReaderActions'

export default class EntryList extends React.Component {
  constructor() {
    super()

    this._getEntryId = this._getEntryId.bind(this)
  }

  componentDidMount() {
    Mousetrap.bind('j', () => FeedReaderActions.scroll(1))
    Mousetrap.bind('k', () => FeedReaderActions.scroll(-1))
    Mousetrap.bind('m', () => {
      const entry = this.props.entries[this.props.activeEntryIndex]
      const newReadStatus = !entry.read
      FeedReaderActions.changeEntryReadStatus(
        this.props.activeFeedId,
        entry.entry_id, newReadStatus)
    })
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
    const entries = this.props.entries
      .filter((entry, index) => index >= this.props.activeEntryIndex)
      .map(entry => (<Entry entry={entry} key={entry.entry_id} />))
    return (
      <div id="entries">
        {entries}
      </div>
    )
  }
}

EntryList.propTypes = {
  entries: React.PropTypes.arrayOf(React.PropTypes.object),
  activeEntryIndex: React.PropTypes.number,
  activeFeedId: React.PropTypes.number,
}

EntryList.defaultProps = {
  entries: [],
  activeEntryIndex: 0,
  activeFeedId: 0,
}
