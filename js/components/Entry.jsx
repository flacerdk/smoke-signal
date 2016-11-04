import React from 'react'

const Entry = (props) => {
  // Trusting that feedparser does proper sanitization here
  const createMarkup = () => ({ __html: props.entry.text })
  const className = props.entry.read ? "entry read" : "entry unread"
  return (
    <div className={className}>
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
    read: React.PropTypes.bool,
  }),
}

module.exports = Entry
