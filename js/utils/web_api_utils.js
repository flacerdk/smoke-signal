import 'whatwg-fetch';

let getRequest = (url) => {
    return fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    });
}

let postJSONRequest = (url, data) => {
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
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      });
}

let addFeed = (url) => {
  return postJSONRequest("/feeds/", {"url": url})
    .catch(ex => console.log("Couldn't add feed: " + ex.message))
}

let refreshFeedList = () => {
  return getRequest("/feeds/")
    .catch(ex => console.log("Couldn't load feed list: " + ex.message))
}

let fetchFeedEntries = (feedId) => {
  return getRequest('/feeds/' + feedId)
    .catch(ex => console.log("Couldn't load feed: " + ex.message))
}

module.exports = {
  addFeed,
  refreshFeedList,
  fetchFeedEntries
}
