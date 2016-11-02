import Entry from './entry.jsx'
import React from 'react'

export default class EntryList extends React.Component {
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
