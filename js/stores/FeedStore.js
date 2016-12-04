import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import ActionTypes from '../constants/FeedReaderConstants'

const CHANGE_EVENT = 'FeedStore.CHANGE_EVENT'

class FeedStore extends EventEmitter {
  constructor() {
    super()

    this._feeds = {}
    this._activeFeed = undefined

    this._addFeed = this._addFeed.bind(this)
    this._setFeed = this._setFeed.bind(this)
    this._updateUnread = this._updateUnread.bind(this)
    this._setActiveFeed = this._setActiveFeed.bind(this)

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)

    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
        case ActionTypes.ADD_FEED:
          this._addFeed(action.feed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.GET_FEED_LIST:
          this._setFeeds(action.feeds._embedded.feeds)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ACTIVE_FEED:
          this._setActiveFeed(action.feed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.REFRESH_FEED:
          this._setFeed(action.feed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ENTRY_STATUS:
          this._setFeed(action.feed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.MARK_ALL_READ:
          this._markAllRead()
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.GET_ENTRY_LIST:
          this._setActiveFeed(undefined)
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

  _addFeed(feed) {
    if (!this._feeds[feed.id]) {
      this._feeds[feed.id] = feed
    }
  }

  _setFeed(feed) {
    this._feeds[feed.id] = feed
  }

  _updateUnread(entry) {
    const feed = this._feeds[entry.feed_id]
    if (entry.read) {
      feed.unread -= 1
    } else {
      feed.unread += 1
    }
    this._setFeed(feed)
  }

  get feeds() {
    const feeds = Object.keys(this._feeds).map(id => this._feeds[id])
    return feeds
  }

  _setFeeds(newFeeds) {
    this._feeds = {}
    newFeeds.map(feed => this._addFeed(feed))
  }

  // FIXME: this is a bit of a hack; note that entries aren't updated.
  _markAllRead() {
    const newFeeds = Object.keys(this._feeds).map((i) => {
      const newFeed = this._feeds[i]
      newFeed.unread = 0
      return newFeed
    })
    this._setFeeds(newFeeds)
  }

  _setActiveFeed(feed) {
    if (typeof feed !== 'undefined' && typeof feed.id !== 'undefined') {
      this._activeFeed = feed
    } else {
      this._activeFeed = undefined
    }
  }

  get activeFeed() {
    return this._activeFeed
  }
}

module.exports = FeedStore
