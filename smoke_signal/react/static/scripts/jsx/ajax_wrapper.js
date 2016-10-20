function getRequest(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      callback(data);
    } else {
      console.error(url, request.responseText);
    }
  };
  request.onerror = function() {
    console.error(url);
  };
  request.send();
};

function postRequest(url, data, callback) {
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type',
                           'application/x-www-form-urlencoded; charset=UTF-8');
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      callback(data);
    } else {
      console.error(url, request.responseText);
    }
  };
  request.onerror = function() {
    console.error(url);
  };
  request.send(data);
}

module.exports = {
  getRequest,
  postRequest
};
