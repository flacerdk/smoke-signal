import Entry from './entry.jsx';
import React from 'react';
import { getRequest } from './ajax_wrapper.js';

export default class EntryList extends React.Component {
  constructor() {
    super();

    this.state = {
      feed_id: 0,
      entries: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params && nextProps.params.id &&
        nextProps.params.id != this.state.feed_id) {
      getRequest('/feeds/' + nextProps.params.id)
        .then(entries => { this.setState({entries: entries})})
        .catch(ex => console.log("Couldn't load feed: " + ex.message));
    }
  }
  render() {
    const entries = this.state.entries.map(entry => {
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
