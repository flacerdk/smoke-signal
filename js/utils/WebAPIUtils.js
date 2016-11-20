import 'isomorphic-fetch'

const csrfToken = document.head.querySelector('[name=csrf-token]').content

const _getRequest = url =>
      fetch(url, {
        credentials: 'same-origin',
      }).then((response) => {
        if (response.ok) {
          if (response.status === 200) {
            return response.json()
          } return []
        } throw Error(response.statusText)
      })

const _postJSONRequest = (url, data) =>
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      })
      .then((response) => {
        if (response.ok) {
          if (response.status === 200) {
            return response.json()
          } return []
        } throw Error(response.statusText)
      })

const addFeed = url => _postJSONRequest('/feeds/', { url })

const getFeedList = () =>
      _getRequest('/feeds/')
      .then(response => response._embedded.feeds)

const refreshFeed = feedId =>
      _postJSONRequest(`/feeds/${feedId}`)

const refreshAllFeeds = () =>
      _postJSONRequest('/feeds/',
                       { refresh: true })
      .then(response => response._embedded.feeds)

const fetchFeedEntries = feedId =>
      _getRequest(`/feeds/${feedId}/all`)

const changeEntryReadStatus = (feedId, entryId, newReadStatus) =>
      _postJSONRequest(`/feeds/${feedId}/${entryId}`,
                       { read: newReadStatus })

const fetchEntries = predicate =>
      _getRequest(`/feeds/${predicate}`)
      .then(response => response._embedded.entries)

module.exports = {
  addFeed,
  getFeedList,
  refreshFeed,
  refreshAllFeeds,
  fetchFeedEntries,
  changeEntryReadStatus,
  fetchEntries,
}
