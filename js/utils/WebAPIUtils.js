import fetch from 'isomorphic-fetch'

const _getRequest = url =>
      fetch(url).then((response) => {
        if (response.ok) {
          if (response.status == 200) {
            return response.json()
          } else {
            return []
          }
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
          if (response.status == 200) {
            return response.json()
          } else {
            return []
          }
        } throw Error(response.statusText)
      })

const addFeed = url => _postJSONRequest('/feeds/', { url })

const refreshFeedList = () =>
      _getRequest('/feeds/')
      .then(response => response["_embedded"]["feeds"])

const refreshFeed = feedId =>
      _postJSONRequest(`/feeds/${feedId}`)
      .then(response => response["_embedded"]["entries"])

const fetchFeedEntries = feedId =>
      _getRequest(`/feeds/${feedId}/entries`)
      .then(response => response["_embedded"]["entries"])

const changeEntryReadStatus = (feedId, entryId, newReadStatus) =>
      _postJSONRequest(`/feeds/${feedId}/entries/${entryId}`,
                       { read: newReadStatus })

module.exports = {
  addFeed,
  refreshFeedList,
  refreshFeed,
  fetchFeedEntries,
  changeEntryReadStatus,
}
