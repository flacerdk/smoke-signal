import ActionTypes from '../constants/FeedReaderConstants'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import WebAPIUtils from '../utils/WebAPIUtils'

module.exports = {
  addFeed: url =>
    WebAPIUtils.addFeed(url).then(newFeed => (
      ActionDispatcher.dispatch({
        type: ActionTypes.ADD_FEED,
        newFeed,
      })
    ), ex => console.log(`Couldn't add feed: ${ex.message}`)),

  getFeedList: () => {
    WebAPIUtils.getFeedList().then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't load feed list: ${ex.message}`))
  },

  refreshAllFeeds: () => {
    WebAPIUtils.getFeedList({ refresh: true }).then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't refresh feeds: ${ex.message}`))
  },

  changeActiveFeed: (feed) => {
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_FEED,
      feed,
    }, ex => console.log(`Couldn't load feed: ${ex.message}`))
  },
}
