import ActionTypes from '../constants/feed_reader_constants.js'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import WebAPIUtils from '../utils/web_api_utils.js'

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
        entries: entries
      })
    }, ex => console.log("Couldn't load feed: " + ex.message))
  },

  scroll: offset => {
    ActionDispatcher.dispatch({
      type: ActionTypes.SCROLL_ENTRY_LIST,
      offset: offset
    })
  }
}
