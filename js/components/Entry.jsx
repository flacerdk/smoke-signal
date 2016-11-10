import React from 'react'

const Entry = (props) => {
  // Trusting that feedparser does proper sanitization here
  const createMarkup = () => ({ __html: props.text })
  const className = props.read ? 'entry read' : 'entry unread'
  return (
    <div className={className}>
      <a className="entry_title" href={props.url}>{props.title}</a>
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
}

Entry.propTypes = {
  title: React.PropTypes.string,
  url: React.PropTypes.string,
  text: React.PropTypes.string,
  read: React.PropTypes.bool,
}

module.exports = Entry
