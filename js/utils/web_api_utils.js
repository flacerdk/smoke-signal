import 'whatwg-fetch'

let _getRequest = (url) => {
    return fetch(url).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw Error(response.statusText)
      }
    })
}

let _postJSONRequest = (url, data) => {
    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(response.statusText)
        }
      })
}

let addFeed = (url) => {
  return _postJSONRequest("/feeds/", {"url": url})
}

let refreshFeedList = () => {
  return _getRequest("/feeds/")
}

let fetchFeedEntries = (feedId) => {
  return _getRequest('/feeds/' + feedId)
}

let markEntryAsRead = (feedId, entryId) => {
  return _postJSONRequest("/feeds/" + feedId + "/read/" + entryId)
}

module.exports = {
  addFeed,
  refreshFeedList,
  fetchFeedEntries,
  markEntryAsRead
}
