import ActionTypes from '../constants/FeedReaderConstants'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import WebAPIUtils from '../utils/WebAPIUtils'

module.exports = {
  addFeed: url =>
    WebAPIUtils.addFeed(url).then(newFeed => (
      ActionDispatcher.dispatch({
        type: ActionTypes.ADD_FEED,
        feed: newFeed,
      })
    )),

  refreshFeed: feed =>
    WebAPIUtils.refreshFeed(feed.id).then((newFeed) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED,
        feed: newFeed,
      })
    }),

  getFeedList: () => {
    WebAPIUtils.getFeedList().then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    ))
  },

  changeActiveFeed: (feed) => {
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_FEED,
      feed,
    })
  },

  markAllRead: () =>
    WebAPIUtils.markAllRead().then(() => (
      ActionDispatcher.dispatch({
        type: ActionTypes.MARK_ALL_READ,
      })
    )),

  deleteFeed: feed =>
    WebAPIUtils.deleteFeed(feed.id).then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    )),

  importOPML: formData =>
    WebAPIUtils.importOPML(formData).then((feeds) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    }),
}
