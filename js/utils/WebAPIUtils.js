import fetch from 'isomorphic-fetch'

const SERVER = 'http://127.0.0.1:5000'

const _getRequest = url =>
      fetch(url).then((response) => {
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
        },
        body: JSON.stringify(data),
      })
      .then((response) => {
        if (response.ok) {
          if (response.status === 200) {
            return response.json()
          } return []
        } throw Error(response.statusText)
      })

const addFeed = url => _postJSONRequest('/feeds/', { url })

const refreshFeedList = () =>
      _getRequest(`${SERVER}/feeds/`)
      .then(response => response._embedded.feeds)

const refreshFeed = feedId =>
      _postJSONRequest(`${SERVER}/feeds/${feedId}`)
      .then(response => response._embedded.entries)

const fetchFeedEntries = feedId =>
      _getRequest(`${SERVER}/feeds/${feedId}/entries`)
      .then(response => response._embedded.entries)

const changeEntryReadStatus = (feedId, entryId, newReadStatus) =>
      _postJSONRequest(`${SERVER}/feeds/${feedId}/entries/${entryId}`,
                       { read: newReadStatus })

module.exports = {
  addFeed,
  refreshFeedList,
  refreshFeed,
  fetchFeedEntries,
  changeEntryReadStatus,
}
