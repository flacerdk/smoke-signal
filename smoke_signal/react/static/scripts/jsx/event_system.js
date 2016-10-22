// Global event system (based on <https://gist.github.com/zpao/8344371>)

var Events = (function() {
  var event_map = {};
  // TODO: this is a very crude way of managing lifecycle. Should improve it
  // later.
  var id = 0;

  return {
    subscribe: function(name, cb) {
      if (!event_map[name]) {
        event_map[name] = [];
      }
      event_map[name].push({id: id, cb: cb});
      id++;
      return id;
    },

    notify: function(name, data) {
      if (!event_map[name]) {
        return;
      }

      event_map[name].forEach(function(item) {
        item.cb(data);
      });
    },

    unsubscribe: function(name, id) {
      var indexToRemove = event_map.findIndex(function(item) {
        return item.id == id;
      });
      delete event_map[name][indexToRemove];
    }
  };
})();

exports.Events = Events;
