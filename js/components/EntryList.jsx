import React from 'react'
import ScrollArea from 'react-scrollbar'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import Mousetrap from 'mousetrap'

import EntryListActions from '../actions/EntryListActions'

require('../styles/entry-list.scss')

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)

    this.activeEntryIndex = 0
    this.scrollActiveEntry = this.scrollActiveEntry.bind(this)
  }

  componentDidMount() {
    Mousetrap.bind('j', () => EntryListActions.changeActiveEntry(this.scrollActiveEntry(1)))
    Mousetrap.bind('k', () => EntryListActions.changeActiveEntry(this.scrollActiveEntry(-1)))
    Mousetrap.bind('m', () => {
      if (Object.keys(this.props.activeEntry).length !== 0) {
        const newReadStatus = { read: !this.props.activeEntry.read }
        EntryListActions.changeEntryStatus(this.props.activeEntry,
          newReadStatus)
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (Object.keys(this.props.activeEntry).length !== 0
      && this.props.activeEntry.id !== prevProps.activeEntry.id) {
      if (this.activeEntry) {
        scrollIntoViewIfNeeded(this.activeEntry)
      }
      if (!this.props.activeEntry.read) {
        EntryListActions.changeEntryStatus(this.props.activeEntry, { read: true })
      }
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
    Mousetrap.unbind('m')
  }

  scrollActiveEntry(offset) {
    const newIndex = this.activeEntryIndex + offset
    if (newIndex >= 0 && newIndex < this.props.entries.length) {
      return this.props.entries[this.activeEntryIndex + offset]
    }
    return this.props.entries[this.activeEntryIndex]
  }

  render() {
    if (this.props.entries.length === 0) {
      return null
    }

    const entries = this.props.entries
      .map((entry, index) => {
        let className = entry.read ? 'list-item read' : 'list-item unread'
        let active = false;
        if (this.props.activeEntry !== {} &&
            this.props.activeEntry.id === entry.id) {
          active = true
          className += ' active'
          this.activeEntryIndex = index
        }
        const onClick = () => EntryListActions.changeActiveEntry(entry)
        const ref = (e) => {
          if (active) {
            this.activeEntry = e
          }
        }
        const component = (
          <button onClick={onClick} ref={ref} className={className} key={entry.id}>
            {entry.title}
          </button>
        )
        return component
      })
    const className = 'list-group entry-list'
    const loadMore = () => EntryListActions.fetchMoreEntries(this.props.next)
    return (
      <ScrollArea
        horizontal={false}
        className="entry-list-container"
      >
        <div className={className}>
          {entries}
          <button className="list-item load-more" onClick={loadMore}>Load more</button>
        </div>
      </ScrollArea>
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
  next: React.PropTypes.string,
}

EntryList.defaultProps = {
  entries: [],
  activeEntry: {},
}
