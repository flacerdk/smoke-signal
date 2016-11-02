import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this._entries = {}
    this._activeFeedId = 0
    this._activeEntryIndex = 0
    this._updateEntry = this._updateEntry.bind(this)
    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.dispatchToken = ActionDispatcher.register(action => {
      switch (action.type) {
      case ActionTypes.FETCH_FEED_ENTRIES:
        this.activeFeedId = action.feedId
        this.entries = action.entries
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.CHANGE_ACTIVE_ENTRY:
        this.activeEntryIndex += action.offset
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.MARK_ENTRY_AS_READ:
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
    return Object.values(this._entries)
  }

  set entries(newEntries) {
    this._entries = {}
    this._activeEntryIndex = 0
    newEntries.forEach(entry => this._entries[entry.entry_id] = entry)
  }

  get activeEntryIndex() {
    return this._activeEntryIndex
  }

  set activeEntryIndex(newIndex) {
    this._activeEntryIndex = newIndex >= 0 ? newIndex : this._activeEntryIndex
  }

  get activeFeedId() {
    return this._activeFeedId
  }

  set activeFeedId(newIndex) {
    this._activeFeedId = newIndex >= 0 ? newIndex : this._activeFeedId
  }

  _updateEntry(newEntry) {
    if (newEntry.entry_id) {
      this._entries[newEntry.entry_id] = newEntry
    }
  }
}

module.exports = new EntryStore()
