import React from 'react'
import Mousetrap from 'mousetrap'
import { ListGroup, ListGroupItem } from 'react-bootstrap/lib'
import EntryListActions from '../actions/EntryListActions'
import FeedListActions from '../actions/FeedListActions'

class FeedList extends React.Component {
  componentDidMount() {
    Mousetrap.bind('r', () => {
      EntryListActions.refreshFeed(this.props.activeFeed)
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
        <ListGroupItem
          href={link}
          onClick={onClick}
          key={feed.id}
        >
          {feed.title} {unread}
        </ListGroupItem>
      )
    })

    const className = 'list-group feed-list'
    return (
      <ListGroup bsClass={className}>
        {feeds}
      </ListGroup>
    )
  }
}

FeedList.propTypes = {
  feeds: React.PropTypes.arrayOf(React.PropTypes.object),
  activeFeed: React.PropTypes.shape({
    id: React.PropTypes.number,
    title: React.PropTypes.string,
    unread: React.PropTypes.number,
  }),
}

module.exports = FeedList
