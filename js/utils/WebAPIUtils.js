import 'isomorphic-fetch'

const BASE_URI = '/smoke_signal'

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

const _postJSONRequest = (url, data) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (typeof document !== 'undefined') {
    headers['X-CSRFToken'] = document.head.querySelector('[name=csrf-token]').content
  }
  return fetch(url, {
    method: 'post',
    headers,
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
}

const addFeed = url => _postJSONRequest(`${BASE_URI}/feeds/`, { url })

const getFeedList = () =>
      _getRequest(`${BASE_URI}/feeds/`)

const refreshFeed = feedId =>
      _postJSONRequest(`${BASE_URI}/feeds/${feedId}`)

const fetchFeedEntries = feedId =>
      _getRequest(`${BASE_URI}/feeds/${feedId}/all`)

const changeEntryStatus = (feedId, entryId, newStatus) =>
      _postJSONRequest(`${BASE_URI}/feeds/${feedId}/${entryId}`,
                       newStatus)

const fetchEntries = predicate =>
      _getRequest(`${BASE_URI}/feeds/${predicate}`)

const markAllRead = () =>
      _postJSONRequest(`${BASE_URI}/feeds/all`, { read: true })

module.exports = {
  addFeed,
  getFeedList,
  refreshFeed,
  fetchFeedEntries,
  changeEntryStatus,
  fetchEntries,
  markAllRead,
}
