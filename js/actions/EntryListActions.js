import ActionTypes from '../constants/FeedReaderConstants'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import WebAPIUtils from '../utils/WebAPIUtils'

module.exports = {
  fetchFeedEntries: (feed) => {
    WebAPIUtils.fetchFeedEntries(feed.id).then((newFeed) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED,
        feed: newFeed,
      })
    })
  },

  fetchEntries: predicate =>
    WebAPIUtils.fetchEntries(predicate).then((entries) => {
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_ENTRY_LIST,
        entries,
      })
    }, ex => console.log(`Couldn't load feed: ${ex.message}`)),

  changeActiveEntry: entry =>
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_ENTRY,
      entry,
    }),

  changeEntryStatus: (entry, newStatus) =>
    WebAPIUtils.changeEntryStatus(entry.feed_id, entry.id, newStatus)
    .then(newEntry => (
      ActionDispatcher.dispatch({
        type: ActionTypes.CHANGE_ENTRY_STATUS,
        entry: newEntry,
      })
    ), ex => console.log(`Couldn't update entry: ${ex.message}`)),
}
