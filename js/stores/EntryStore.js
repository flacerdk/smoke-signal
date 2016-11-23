import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import ActionTypes from '../constants/FeedReaderConstants'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this._entries = {}
    this._activeEntry = {}

    this._getEntries = this._getEntries.bind(this)
    this._setEntries = this._setEntries.bind(this)
    this._setActiveEntry = this._setActiveEntry.bind(this)
    this._updateEntry = this._updateEntry.bind(this)

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)

    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
        case ActionTypes.GET_ENTRY_LIST:
          this._setEntries(action.feed._embedded.entries)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ACTIVE_ENTRY:
          this._setActiveEntry(action.entry)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ENTRY_STATUS:
          this._updateEntry(action.entry)
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

  get entries() {
    return this._getEntries()
  }

  _getEntries() {
    return Object.keys(this._entries).map(i => this._entries[i])
  }

  _setEntries(newEntries) {
    this._entries = {}
    if (newEntries.length > 0) {
      this._activeEntry = newEntries[0]
    } else {
      this._activeEntry = {}
    }
    newEntries.forEach((entry) => {
      this._entries[entry.id] = entry
      return false
    })
  }

  get activeEntry() {
    return this._activeEntry
  }

  _setActiveEntry(newEntry) {
    this._activeEntry = newEntry
  }

  _updateEntry(newEntry) {
    if (newEntry.id) {
      this._entries[newEntry.id] = newEntry
    }
  }
}

module.exports = EntryStore
