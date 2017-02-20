import React from 'react'

require('../styles/page-header.scss')

const FeedPageHeader = (props) => {
  let actionButton = ''
  if (typeof props.action !== 'undefined') {
    actionButton = (
      <button onClick={props.action.onClick}>{props.action.text}</button>
    )
  }

  return (
    <header>
      {props.title}
      <div className="unsubscribe-button">{actionButton}</div>
    </header>
  )
}

FeedPageHeader.propTypes = {
  title: React.PropTypes.string,
  action: React.PropTypes.shape({
    text: React.PropTypes.string,
    onClick: React.PropTypes.func,
  }),
}

FeedPageHeader.defaultProps = {
  title: '',
  action: undefined,
}

module.exports = FeedPageHeader
