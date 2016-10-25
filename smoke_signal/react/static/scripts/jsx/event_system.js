// Global event system (based on <https://gist.github.com/zpao/8344371>)

let Events = (() => {
  let event_map = {};
  // TODO: this is a very crude way of managing lifecycle. Should improve it
  // later.
  let id = 0;
  return {
    subscribe: (name, cb) => {
      if (!event_map[name]) {
        event_map[name] = [];
      }
      event_map[name].push({id: id, cb: cb});
      id++;
      return id;
    },

    notify: (name, data) => {
      if (!event_map[name]) {
        return;
      }

      event_map[name].forEach(item => {
        item.cb(data);
      });
    },

    unsubscribe: (name, id) => {
      const indexToRemove = event_map.findIndex(item => {
        return item.id == id;
      });
      delete event_map[name][indexToRemove];
    }
  };
})();

exports.Events = Events;
