import React from 'react'
import FeedReaderActions from '../actions/FeedReaderActions'

const handleFeedClicked = feed => FeedReaderActions.changeActiveFeed(feed)

const FeedList = (props) => {
  const feeds = props.feeds.map((feed) => {
    const link = `#/feeds/${feed.id}`
    const onClick = handleFeedClicked.bind(null, feed)
    let unread = '';
    if (typeof feed.unread !== 'undefined' &&
        feed.unread != null && feed.unread > 0) {
      unread = `(${feed.unread})`
    }
    return (
      <li className="feed" key={feed.id}>
        <a className="feed" href={link} onClick={onClick}>{feed.title} {unread}</a>
      </li>
    )
  })

  return (
    <div id="feeds">
      <ul className="feed_list">{feeds}</ul>
    </div>
  )
}

FeedList.propTypes = {
  feeds: React.PropTypes.arrayOf(React.PropTypes.object),
}

module.exports = FeedList
