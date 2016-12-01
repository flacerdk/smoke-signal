import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import ActionTypes from '../constants/FeedReaderConstants'

const CHANGE_EVENT = 'EntryStore.CHANGE_EVENT'

class EntryStore extends EventEmitter {
  constructor() {
    super()

    this._entries = []
    this._activeEntry = {}
    this._next = ''

    this._getEntries = this._getEntries.bind(this)
    this._setEntries = this._setEntries.bind(this)
    this._setActiveEntry = this._setActiveEntry.bind(this)
    this._updateEntry = this._updateEntry.bind(this)

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)

    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
        case ActionTypes.GET_FEED:
          this._setEntries(action.feed._embedded.entries)
          this._setNext(action.next)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.GET_ENTRY_LIST:
          this._setEntries(action.entries)
          this._setNext(action.next)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.ADD_ENTRIES:
          this._addEntries(action.entries)
          this._setNext(action.next)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ACTIVE_ENTRY:
          this._setActiveEntry(action.entry)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ENTRY_STATUS:
          this._updateEntry(action.feed._embedded.entry)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.MARK_ALL_READ:
          this._markAllEntriesRead()
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
    return this._entries
  }

  _setEntries(newEntries) {
    this._entries = newEntries
    if (newEntries.length > 0) {
      this._activeEntry = newEntries[0]
    } else {
      this._activeEntry = {}
    }
    this._setNext('')
  }

  _addEntries(newEntries) {
    this._entries = this._entries.concat(newEntries)
  }

  _markAllEntriesRead() {
    const newEntries = this._entries.map((e) => {
      const newEntry = e
      newEntry.read = true
      return newEntry
    })
    this._setEntries(newEntries)
  }

  get activeEntry() {
    return this._activeEntry
  }

  _setActiveEntry(newEntry) {
    this._activeEntry = newEntry
  }

  _updateEntry(newEntry) {
    if (newEntry.id) {
      const idx = this._entries.findIndex(e => e.id === newEntry.id)
      this._entries[idx] = newEntry
    }
  }

  _setNext(next) {
    this._next = next
  }

  get next() {
    return this._next
  }
}

module.exports = EntryStore
