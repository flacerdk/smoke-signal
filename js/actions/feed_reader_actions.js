import ActionTypes from '../constants/feed_reader_constants.js'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import WebAPIUtils from '../utils/ajax_wrapper.js'

module.exports = {
  addFeed: (url) => {
    WebAPIUtils.addFeed(url).then(new_feed => {
      ActionDispatcher.dispatch({
        type: ActionTypes.ADD_FEED,
        new_feed: new_feed
      })
    })
  },

  refreshFeedList: () => {
    WebAPIUtils.refreshFeedList().then(feeds => {
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED_LIST,
        feeds: feeds
      })
    })
  },

  fetchFeedEntries: (feedId) => {
    WebAPIUtils.fetchFeedEntries(feedId).then(entries => {
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        entries: entries
      })
    })
  }
}
