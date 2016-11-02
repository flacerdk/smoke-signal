import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

let _entries = []

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

    this.firstActiveEntry = 0
    this.getFirstActiveEntry = this.getFirstActiveEntry.bind(this)
    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.dispatchToken = ActionDispatcher.register(action => {
      switch (action.type) {
      case ActionTypes.FETCH_FEED_ENTRIES:
        _refreshFeedEntries(action.entries)
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.SCROLL_ENTRY_LIST:
        this.firstActiveEntry += action.offset
        if (this.firstActiveEntry < 0) {
          this.firstActiveEntry = 0
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

  getFirstActiveEntry() {
    return this.firstActiveEntry
  }
}

module.exports = new EntryStore()
