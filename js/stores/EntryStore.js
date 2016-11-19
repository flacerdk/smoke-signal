import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import ActionTypes from '../constants/FeedReaderConstants'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this._entries = {}
    this._activeFeedId = 0
    this._activeEntryIndex = 0

    this._setEntries = this._setEntries.bind(this)
    this._setActiveEntryIndex = this._setActiveEntryIndex.bind(this)
    this._setActiveFeedId = this._setActiveFeedId.bind(this)
    this._updateEntry = this._updateEntry.bind(this)

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)

    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
        case ActionTypes.FETCH_FEED_ENTRIES:
          this._setActiveFeedId(action.feedId)
          this._setEntries(action.entries)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ACTIVE_ENTRY:
          this._setActiveEntryIndex(this._activeEntryIndex + action.offset)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.MARK_ENTRY_AS_READ:
          this._updateEntry(action.entry)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.FETCH_ENTRIES:
          this._setActiveFeedId(0)
          this._setEntries(action.entries)
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
    return Object.keys(this._entries).map(i => this._entries[i])
  }

  _setEntries(newEntries) {
    this._entries = {}
    this._activeEntryIndex = 0
    newEntries.forEach((entry) => {
      this._entries[entry.id] = entry
      return false
    })
  }

  get activeEntryIndex() {
    return this._activeEntryIndex
  }

  _setActiveEntryIndex(newIndex) {
    this._activeEntryIndex = newIndex >= 0 ? newIndex : this._activeEntryIndex
  }

  get activeFeedId() {
    return this._activeFeedId
  }

  _setActiveFeedId(newIndex) {
    this._activeFeedId = newIndex >= 0 ? newIndex : this._activeFeedId
  }

  _updateEntry(newEntry) {
    if (newEntry.id) {
      this._entries[newEntry.id] = newEntry
    }
  }
}

module.exports = EntryStore
