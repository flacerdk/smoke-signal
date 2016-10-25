import fetch from 'whatwg-fetch';

module.exports = {
  getRequest: (url, callback) => {
    fetch(url)
      .then(response => { return callback(response.json()); })
      .catch(ex => { console.log('GET request failed', ex); });
  },

  postJSONRequest: (url, data, callback) => {
    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => { return callback(response.json()); })
      .catch(ex => { console.log('POST request failed', ex); });
  }
};
