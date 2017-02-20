import React from 'react'
import Mousetrap from 'mousetrap'
import EntryListActions from '../actions/EntryListActions'
import FeedListActions from '../actions/FeedListActions'

require('../styles/feed-list.scss')

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
        <button onClick={onClick} key={feed.id} className="list-item">
          {feed.title}{unread}
        </button>
      )
    })

    const className = 'list-group feed-list'
    return (
      <div className={className}>
        {feeds}
      </div>
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
