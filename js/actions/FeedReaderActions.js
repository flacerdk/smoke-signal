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
        type: ActionTypes.REFRESH_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't load feed list: ${ex.message}`))
  },

  refreshAllFeeds: () => {
    WebAPIUtils.refreshAllFeeds().then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't refresh feeds: ${ex.message}`))
  },

  refreshFeed: feedId =>
    WebAPIUtils.refreshFeed(feedId).then((response) => {
      const feed = response
      const entries = response._embedded.entries
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED,
        feed,
      })
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        feedId,
        entries,
      })
    }, ex => console.log(`Couldn't refresh feed: ${ex.message}`)),

  fetchFeedEntries: feedId =>
    WebAPIUtils.fetchFeedEntries(feedId).then((response) => {
      const feed = response
      const entries = response._embedded.entries
      ActionDispatcher.dispatch({
        type: ActionTypes.CHANGE_ACTIVE_FEED,
        feed,
      })
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        entries,
      })
    }, ex => console.log(`Couldn't load feed: ${ex.message}`)),

  changeActiveEntry: entry =>
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_ENTRY,
      entry,
    }),

  changeEntryReadStatus: (entry, newReadStatus) =>
    WebAPIUtils.changeEntryReadStatus(entry.feed_id, entry.id, newReadStatus)
    .then(newEntry => (
      ActionDispatcher.dispatch({
        type: ActionTypes.MARK_ENTRY_AS_READ,
        entry: newEntry,
      })
    ), ex => console.log(`Couldn't update entry: ${ex.message}`)),

  fetchEntries: predicate =>
    WebAPIUtils.fetchEntries(predicate).then((entries) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.CHANGE_ACTIVE_FEED,
      })
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_ENTRIES,
        entries,
      })
    }, ex => console.log(`Couldn't load feed: ${ex.message}`)),
}
