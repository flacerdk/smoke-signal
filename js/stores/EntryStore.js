import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this._entries = []
    this._activeEntryIndex = 0
    this._addEntry = this._addEntry.bind(this)
    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.dispatchToken = ActionDispatcher.register(action => {
      switch (action.type) {
      case ActionTypes.FETCH_FEED_ENTRIES:
        this.entries = action.entries
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.CHANGE_ACTIVE_ENTRY:
        this.activeEntryIndex += action.offset
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
    return this._entries
  }

  get activeEntryIndex() {
    return this._activeEntryIndex
  }

  set activeEntryIndex(newIndex) {
    this._activeEntryIndex = newIndex >= 0 ? newIndex : this._activeEntryIndex
  }

  _addEntry(entry) {
    this._entries.push(entry)
  }

  set entries(newEntries) {
    this._entries = []
    this._activeEntryIndex = 0
    newEntries.map(this._addEntry)
  }
}

module.exports = new EntryStore()
