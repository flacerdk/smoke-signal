import React from 'react'
import Mousetrap from 'mousetrap'
import EntryListActions from '../actions/EntryListActions'
import FeedListActions from '../actions/FeedListActions'

class FeedList extends React.Component {
  // TODO: should notify the user when errors occur.
  componentDidMount() {
    Mousetrap.bind('r', () => {
      if (typeof this.props.activeFeed !== 'undefined'
        && Object.keys(this.props.activeFeed).length !== 0) {
        FeedListActions.refreshFeed(this.props.activeFeed)
          .then(() => EntryListActions.fetchFeedEntries(this.props.activeFeed))
          .catch(e => console.log(`Couldn't refresh feed: ${e.message}`))
      }
    })
    Mousetrap.bind('g r', () => {
      this.props.feeds.map(feed =>
        FeedListActions.refreshFeed(feed)
        .catch(e => console.log(`Couldn't refresh feed: ${e.message}`)))
    })
    Mousetrap.bind('g m', () => {
      FeedListActions.markAllRead()
        .catch(e => console.log(`Failed trying to mark entries as read: ${e.message}`))
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind('r')
    Mousetrap.unbind('g r')
    Mousetrap.unbind('g m')
  }

  render() {
    if (this.props.feeds.length === 0) {
      return null
    }

    const feeds = this.props.feeds.map((feed) => {
      const link = `#/api/feed/${feed.id}`
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
        <li key={feed.id}>
          <a href={link} onClick={onClick}>{feed.title}{unread}</a>
        </li>
      )
    })

    const className = 'list-group feed-list'
    return (
      <ul className={className}>
        {feeds}
      </ul>
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

FeedList.defaultProps = {
  feeds: {},
  activeFeed: undefined,
}

module.exports = FeedList
