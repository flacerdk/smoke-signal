import React from 'react';
import { getRequest } from './ajax_wrapper.js';

export default class EntryList extends React.Component {
  constructor() {
    super();

    this.state = {
      entries: [],
    };

  }

  componentWillReceiveProps(nextProps) {
    getRequest('/feeds/' + nextProps.params.id)
      .then(entries => {
          this.setState({entries: entries});
        })
      .catch(ex => console.log("Couldn't load feed: " + ex.message));
  }

  render() {
    const entries = this.state.entries.map(entry => {
      // Trusting that feedparser does proper sanitization here
      function createMarkup() { return { __html: entry.text } };
      return (
        <div className="entry" key={entry.entry_id}>
          <a className="entry_title" href={entry.url}>{entry.title}</a>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
      );
    });
    return (
      <div id="entries">
        {entries}
      </div>
    );
  }
}
