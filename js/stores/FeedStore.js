import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/ActionDispatcher'
import ActionTypes from '../constants/FeedReaderConstants'

const CHANGE_EVENT = 'FeedStore.CHANGE_EVENT'

class FeedStore extends EventEmitter {
  constructor() {
    super()

    this._feeds = {}
    this._activeId = 0

    this._addFeed = this._addFeed.bind(this)

    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)

    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
        case ActionTypes.ADD_FEED:
          this._addFeed(action.newFeed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.REFRESH_FEED_LIST:
          this._setFeeds(action.feeds)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.REFRESH_FEED:
          this._setFeed(action.feed)
          this.emit(CHANGE_EVENT)
          break
        case ActionTypes.CHANGE_ACTIVE_FEED:
          this._setActiveFeed(action.feed)
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

  _addFeed(feed) {
    if (!this._feeds[feed.id]) {
      this._feeds[feed.id] = feed
    }
  }

  _setFeed(feed) {
    this._feeds[feed.id] = feed
  }

  get feeds() {
    const feeds = Object.keys(this._feeds).map(id => this._feeds[id])
    return feeds
  }

  _setFeeds(newFeeds) {
    this._feeds = {}
    newFeeds.map(feed => this._addFeed(feed))
  }

  _setActiveFeed(feed) {
    if (typeof feed !== 'undefined' && typeof feed.id !== 'undefined') {
      this._activeId = feed.id
    } else {
      this._activeId = 0
    }
  }

  get activeId() {
    return this._activeId
  }
}

module.exports = FeedStore
