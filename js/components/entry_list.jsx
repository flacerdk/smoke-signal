import React from 'react'
import Mousetrap from 'mousetrap'
import Entry from './entry.jsx'
import FeedReaderActions from '../actions/feed_reader_actions.js'

export default class EntryList extends React.Component {
  componentDidMount() {
    Mousetrap.bind('j', () => FeedReaderActions.scroll(1))
    Mousetrap.bind('k', () => FeedReaderActions.scroll(-1))
  }

  componentWillUnmount() {
    Mousetrap.unbind('j')
    Mousetrap.unbind('k')
  }

  render() {
    const entries = this.props.entries.map((entry, index) => {
      if (index >= this.props.firstActiveEntry) {
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
  firstActiveEntry: React.PropTypes.number
}

EntryList.defaultProps = {
  entries: [],
  firstActiveEntry: 0
}
