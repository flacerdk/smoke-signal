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

  refreshFeedList: () => {
    WebAPIUtils.refreshFeedList().then(feeds => (
      ActionDispatcher.dispatch({
        type: ActionTypes.REFRESH_FEED_LIST,
        feeds,
      })
    ), ex => console.log(`Couldn't load feed list: ${ex.message}`))
  },

  refreshFeed: feedId =>
    WebAPIUtils.refreshFeed(feedId).then(entries => (
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        feedId,
        entries,
      })
    ), ex => console.log(`Couldn't refresh feed: ${ex.message}`)),

  fetchFeedEntries: feedId =>
    WebAPIUtils.fetchFeedEntries(feedId).then(entries => (
      ActionDispatcher.dispatch({
        type: ActionTypes.FETCH_FEED_ENTRIES,
        feedId,
        entries,
      })
    ), ex => console.log(`Couldn't load feed: ${ex.message}`)),

  scroll: offset =>
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_ENTRY,
      offset,
    }),

  changeEntryReadStatus: (feedId, entryId, newReadStatus) =>
    WebAPIUtils.changeEntryReadStatus(feedId, entryId, newReadStatus)
    .then(entry => (
      ActionDispatcher.dispatch({
        type: ActionTypes.MARK_ENTRY_AS_READ,
        entry,
      })
    ), ex => console.log(`Couldn't update entry: ${ex.message}`)),
}
