import React from 'react'
import Mousetrap from 'mousetrap'
import FeedReaderActions from '../actions/FeedReaderActions'

export default class EntryList extends React.Component {
  constructor() {
    super()

    this._getEntryId = this._getEntryId.bind(this)
    this.scrollToActiveEntry = this.scrollToActiveEntry.bind(this)
  }

  componentDidMount() {
    Mousetrap.bind('j', () => FeedReaderActions.changeActiveEntry(this.props.activeEntryId + 1))
    Mousetrap.bind('k', () => FeedReaderActions.changeActiveEntry(this.props.activeEntryId - 1))
    Mousetrap.bind('m', () => {
      const activeEntry = this.props.entries[this.props.activeEntryId]
      const newReadStatus = !activeEntry.read
      FeedReaderActions.changeEntryReadStatus(
        activeEntry.feed_id,
        activeEntry.id, newReadStatus)
    })
    Mousetrap.bind('r', () => {
      FeedReaderActions.refreshFeed(this.props.activeFeedId)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeEntryId !== prevProps.activeEntryId) {
      this.scrollToActiveEntry()
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('m')
    Mousetrap.unbind('r')
  }

  scrollToActiveEntry() {
    if (this.activeEntry) {
      this.activeEntry.scrollIntoView()
    }
  }

  _getEntryId(index) {
    return this.props.entries[index].id
  }

  render() {
    const entries = this.props.entries
      .map((entry) => {
        // Trusting that feedparser does proper sanitization here
        const createMarkup = () => ({ __html: entry.text })
        const className = entry.read ? 'entry read' : 'entry unread'
        const setActiveRef = (e) => {
          if (this.props.activeEntryId === entry.id) {
            this.activeEntry = e
          }
        }
        return (
          <div className={className} ref={setActiveRef} key={entry.id}>
            <a className="entry_title" href={entry.url}>{entry.title}</a>
            <div dangerouslySetInnerHTML={createMarkup()} />
          </div>
        )
      })
    return (
      <div id="entries">
        {entries}
      </div>
    )
  }
}

EntryList.propTypes = {
  entries: React.PropTypes.arrayOf(React.PropTypes.object),
  activeEntryId: React.PropTypes.number,
  activeFeedId: React.PropTypes.number,
}

EntryList.defaultProps = {
  entries: [],
  activeEntryId: 0,
  activeFeedId: 0,
}
