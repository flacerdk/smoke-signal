import fetch from 'isomorphic-fetch'

const _getRequest = url =>
      fetch(url).then((response) => {
        if (response.ok) {
          return response.json()
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
      return response.json()
    } throw Error(response.statusText)
  })

const addFeed = url => _postJSONRequest('/feeds/', { url })

const refreshFeedList = () =>
      _getRequest('/feeds/')
      .then(response => response["_embedded"]["feeds"])

const fetchFeedEntries = feedId =>
      _getRequest(`/feeds/${feedId}`)
      .then(response => response["_embedded"]["entries"])

const changeEntryReadStatus = (feedId, entryId, newReadStatus) =>
      _postJSONRequest(`/feeds/${feedId}/${entryId}`,
                       { read: newReadStatus })

module.exports = {
  addFeed,
  refreshFeedList,
  fetchFeedEntries,
  changeEntryReadStatus,
}
