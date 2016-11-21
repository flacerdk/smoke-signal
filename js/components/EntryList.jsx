import React from 'react'
import Mousetrap from 'mousetrap'
import FeedReaderActions from '../actions/FeedReaderActions'

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)

    this.activeEntryIndex = 0
    this.scrollToActiveEntry = this.scrollToActiveEntry.bind(this)
    this.scrollActiveEntry = this.scrollActiveEntry.bind(this)
  }

  componentDidMount() {
    Mousetrap.bind('j', () => FeedReaderActions.changeActiveEntry(this.scrollActiveEntry(1)))
    Mousetrap.bind('k', () => FeedReaderActions.changeActiveEntry(this.scrollActiveEntry(-1)))
    Mousetrap.bind('m', () => {
      const newReadStatus = !this.props.activeEntry.read
      FeedReaderActions.changeEntryReadStatus(
        this.props.activeEntry.feed_id,
        this.props.activeEntry.id, newReadStatus)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeEntry.id !== prevProps.activeEntry.id) {
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

  scrollActiveEntry(offset) {
    const newIndex = this.activeEntryIndex + offset
    if (newIndex >= 0 && newIndex < this.props.entries.length) {
      return this.props.entries[this.activeEntryIndex + offset]
    }
    return this.props.entries[this.activeEntryIndex]
  }

  render() {
    const entries = this.props.entries
      .map((entry, index) => {
        const className = entry.read ? 'entry read' : 'entry unread'
        const setActiveRef = (e) => {
          if (this.props.activeEntry !== {} &&
              this.props.activeEntry.id === entry.id) {
            this.activeEntry = e
            this.activeEntryIndex = index
          }
        }
        const onClick = () => FeedReaderActions.changeActiveEntry(entry)
        const href = `#/${entry.feed_id}/${entry.id}`
        return (
          <li className={className} ref={setActiveRef} key={entry.id}>
            <a className="entry_title" href={href} onClick={onClick}>{entry.title}</a>
          </li>
        )
      })
    const createMarkup = () => ({ __html: this.props.activeEntry.text })
    const href = this.props.activeEntry.url
    const title = this.props.activeEntry.title
    // Trusting that feedparser does proper sanitization here.
    const activeEntry = (
      <div id="active_entry">
        <a className="entry_title" href={href}>{title}</a>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    )
    return (
      <div id="wrapper">
        <ul id="entries">
          {entries}
        </ul>
        {activeEntry}
      </div>
    )
  }
}

EntryList.propTypes = {
  entries: React.PropTypes.arrayOf(React.PropTypes.object),
  activeEntry: React.PropTypes.shape({
    id: React.PropTypes.number,
    feed_id: React.PropTypes.number,
    title: React.PropTypes.string,
    text: React.PropTypes.string,
    url: React.PropTypes.string,
    read: React.PropTypes.bool,
  }),
}

EntryList.defaultProps = {
  entries: [],
  activeEntry: {},
}
