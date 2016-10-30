import Entry from './entry.jsx';
import React from 'react';
import { getRequest } from './ajax_wrapper.js';

export default class EntryList extends React.Component {
  render() {
    const entries = this.props.entries.map(entry => {
      return (
          <Entry
              title={entry.title}
              url={entry.url}
              text={entry.text}
              key={entry.entry_id} />
      );
    });
    return (
      <div id="entries">
        {entries}
      </div>
    );
  }
}
