import React from 'react'

const Entry = (props) => {
  const createMarkup = () => ({ __html: props.text })
  // Trusting that feedparser does proper sanitization here.
  return (
    <div className="active-entry">
      <a className="entry-title" href={props.url}>{props.title}</a>
      <div className="entry-body" dangerouslySetInnerHTML={createMarkup()} />
    </div>
  )
}

Entry.propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string,
  url: React.PropTypes.string,
}

module.exports = Entry
