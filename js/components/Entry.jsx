import React from 'react'

const Entry = (props) => {
  // Trusting that feedparser does proper sanitization here
  const createMarkup = () => ({ __html: props.entry.text })
  return (
    <div className="entry">
      <a className="entry_title" href={props.entry.url}>{props.entry.title}</a>
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
}

Entry.propTypes = {
  entry: React.PropTypes.shape({
    title: React.PropTypes.string,
    url: React.PropTypes.string,
    text: React.PropTypes.string,
  }),
}

module.exports = Entry
