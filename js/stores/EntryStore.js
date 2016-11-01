import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

let _entries = []
let firstActiveEntryIndex = 0

let _addEntry = entry => {
  _entries.push(entry)
}

let _refreshFeedEntries = newEntries => {
  _entries = []
  newEntries.map(_addEntry)
}

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.dispatchToken = ActionDispatcher.register(action => {
      switch (action.type) {
      case ActionTypes.FETCH_FEED_ENTRIES:
        _refreshFeedEntries(action.entries)
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.SCROLL_ENTRY_LIST:
        firstActiveEntryIndex += action.offset
        if (firstActiveEntryIndex < 0) {
          firstActiveEntryIndex = 0
        }
        this.emit(CHANGE_EVENT)
        break
      default:
        // no op
      }
    })
  }

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }

  getAllEntries() {
    return _entries
  }

  getActiveEntries() {
    return _entries.filter((entry, index) => index >= firstActiveEntryIndex)
  }
}

module.exports = new EntryStore()
