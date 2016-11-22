import React from 'react'
import ReactDOM from 'react-dom'
import Mousetrap from 'mousetrap'
import { ListGroup, ListGroupItem } from 'react-bootstrap/lib'
import EntryListActions from '../actions/EntryListActions'

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
      const newReadStatus = { read: !this.props.activeEntry.read }
      EntryListActions.changeEntryStatus(this.props.activeEntry,
        newReadStatus)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeEntry.id !== prevProps.activeEntry.id) {
      if (this.activeEntry) {
        this.activeEntry.scrollIntoView(false)
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
    const entries = this.props.entries
      .map((entry, index) => {
        const className = entry.read ? 'list-group-item read' : 'list-group-item unread'
        let active = false;
        if (this.props.activeEntry !== {} &&
            this.props.activeEntry.id === entry.id) {
          active = true
          this.activeEntryIndex = index
        }
        const onClick = () => EntryListActions.changeActiveEntry(entry)
        const ref = (e) => {
          if (active) {
            this.activeEntry = e
          }
        }
        const component = (
          <ListGroupItem
            bsClass={className}
            active={active}
            onClick={onClick}
            key={entry.id}
          >
            <div className="entry-title" ref={ref}>
              {entry.title}
            </div>
          </ListGroupItem>
        )
        return component
      })
    const className = 'list-group entry-list'
    return (
      <ListGroup bsClass={className}>
        {entries}
      </ListGroup>
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
