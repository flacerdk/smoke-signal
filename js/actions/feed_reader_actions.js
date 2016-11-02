import ActionTypes from '../constants/feed_reader_constants'
import ActionDispatcher from '../dispatcher/action_dispatcher'
import WebAPIUtils from '../utils/web_api_utils'

module.exports = {
  addFeed: url => {
    WebAPIUtils.addFeed(url).then(new_feed => {
      ActionDispatcher.dispatch({
        type: ActionTypes.ADD_FEED,
        new_feed: new_feed
      })
    }, ex => console.log("Couldn't add feed: " + ex.message))
  },

  refreshFeedList: () => {
    WebAPIUtils.refreshFeedList().then(feeds => {
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED_LIST,
        feeds: feeds
      })
    }, ex => console.log("Couldn't load feed list: " + ex.message))
  },

  fetchFeedEntries: feedId => {
    WebAPIUtils.fetchFeedEntries(feedId).then(entries => {
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        feedId: feedId,
        entries: entries
      })
    }, ex => console.log("Couldn't load feed: " + ex.message))
  },

  scroll: offset => {
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_ENTRY,
      offset: offset
    })
  },

  markEntryAsRead: (feedId, entryId) => {
    WebAPIUtils.markEntryAsRead(feedId, entryId).then((entry) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.MARK_ENTRY_AS_READ,
        entry: entry
      })
    }, ex => console.log("Couldn't update entry: " + ex.message))
  }
}
