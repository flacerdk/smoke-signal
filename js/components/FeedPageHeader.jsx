import React from 'react'
import { Button } from 'react-bootstrap/lib'

const FeedPageHeader = (props) => {
  let actionButton = ''
  if (typeof props.action !== 'undefined') {
    actionButton = (
      <Button onClick={props.action.onClick}>{props.action.text}</Button>
    )
  }

  return (
    <div id="feed-header">
      {actionButton}
      <h1>{props.title}</h1>
    </div>
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
