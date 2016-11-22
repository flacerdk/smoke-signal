import React from 'react'
import Mousetrap from 'mousetrap'
import EntryListActions from '../actions/EntryListActions'
import FeedListActions from '../actions/FeedListActions'

class FeedList extends React.Component {
  componentDidMount() {
    Mousetrap.bind('r', () => {
      FeedListActions.refreshFeed(this.state.activeFeed)
    })
    Mousetrap.bind('g r', () => {
      FeedListActions.refreshAllFeeds()
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind('r')
    Mousetrap.unbind('g r')
  }

  render() {
    const feeds = this.props.feeds.map((feed) => {
      const link = `#/feeds/${feed.id}`
      const onClick = () => {
        FeedListActions.changeActiveFeed(feed)
        EntryListActions.fetchFeedEntries(feed)
      }
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
}

FeedList.propTypes = {
  feeds: React.PropTypes.arrayOf(React.PropTypes.object),
}

module.exports = FeedList
