import React from 'react'
import { Button, PageHeader } from 'react-bootstrap/lib'

const FeedPageHeader = (props) => {
  let actionButton = ''
  if (typeof props.action !== 'undefined') {
    actionButton = (
      <Button onClick={props.action.onClick}>{props.action.text}</Button>
    )
  }

  return (
    <PageHeader>
      {props.title}
      <div className="unsubscribe-button">{actionButton}</div>
    </PageHeader>
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
