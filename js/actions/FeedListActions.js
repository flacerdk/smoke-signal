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
    }, ex => console.log(`Couldn't refresh feed: ${ex.message}`)),

  getFeedList: () => {
    WebAPIUtils.getFeedList().then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't load feed list: ${ex.message}`))
  },

  changeActiveFeed: (feed) => {
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_FEED,
      feed,
    }, ex => console.log(`Couldn't load feed: ${ex.message}`))
  },

  markAllRead: () =>
    WebAPIUtils.markAllRead().then(() => (
      ActionDispatcher.dispatch({
        type: ActionTypes.MARK_ALL_READ,
      })
    )),
}
