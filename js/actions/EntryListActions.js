import ActionTypes from '../constants/FeedReaderConstants'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import WebAPIUtils from '../utils/WebAPIUtils'

const _getEntryList = (response) => {
  const entries = response._embedded.entries
  let next = ''
  if ('next' in response._links) {
    next = response._links.next.href
  }
  ActionDispatcher.dispatch({
    type: ActionTypes.GET_ENTRY_LIST,
    entries,
    next,
  })
}

module.exports = {
  fetchFeedEntries: (feed) => {
    WebAPIUtils.fetchFeedEntries(feed.id).then((newFeed) => {
      let next = ''
      if ('next' in newFeed._links) {
        next = newFeed._links.next.href
      }
      ActionDispatcher.dispatch({
        type: ActionTypes.GET_FEED,
        feed: newFeed,
        next,
      })
    })
  },

  fetchEntries: (predicate) => {
    WebAPIUtils.fetchEntries(predicate).then(
      response => _getEntryList(response),
      ex => console.log(`Couldn't load feed: ${ex.message}`))
  },

  fetchMoreEntries: (url) => {
    WebAPIUtils.getRequest(url).then(
      (response) => {
        const entries = response._embedded.entries
        let next = ''
        if ('next' in response._links) {
          next = response._links.next.href
        }
        ActionDispatcher.dispatch({
          type: ActionTypes.ADD_ENTRIES,
          entries,
          next,
        })
      },
      ex => console.log(`Couldn't load feed: ${ex.message}`))
  },

  changeActiveEntry: entry =>
    ActionDispatcher.dispatch({
      type: ActionTypes.CHANGE_ACTIVE_ENTRY,
      entry,
    }),

  changeEntryStatus: (entry, newStatus) =>
    WebAPIUtils.changeEntryStatus(entry.feed_id, entry.id, newStatus)
    .then(feed => (
      ActionDispatcher.dispatch({
        type: ActionTypes.CHANGE_ENTRY_STATUS,
        feed,
      })
    ), ex => console.log(`Couldn't update entry: ${ex.message}`)),
}
