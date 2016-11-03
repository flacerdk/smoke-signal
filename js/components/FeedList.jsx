import React from 'react'
import FeedReaderActions from '../actions/FeedReaderActions'

const handleFeedClicked = feedId => FeedReaderActions.fetchFeedEntries(feedId)

const FeedList = (props) => {
  const feeds = props.feeds.map((feed) => {
    const link = `#/feeds/${feed.id}`
    const onClick = handleFeedClicked.bind(null, feed.id)
    return (
      <li className="feed" key={feed.id}>
        <a className="feed" href={link} onClick={onClick}>{feed.title}</a>
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
