import React from 'react'

const Entry = (props) => {
  const createMarkup = () => ({ __html: props.text })
  // Trusting that feedparser does proper sanitization here.
  return (
    <div id="active_entry">
      <a className="entry_title" href={props.url}>{props.title}</a>
      <div className="entry_body" dangerouslySetInnerHTML={createMarkup()} />
    </div>
  )
}

Entry.propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string,
  url: React.PropTypes.string,
}

module.exports = Entry
