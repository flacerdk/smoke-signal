import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'FeedStore.CHANGE_EVENT'

class FeedStore extends EventEmitter {
  constructor() {
    super()

    this._feeds = {}
    this._addFeed = this._addFeed.bind(this)
    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.dispatchToken = ActionDispatcher.register(action => {
      switch (action.type) {
      case ActionTypes.ADD_FEED:
        this._addFeed(action.new_feed)
        this.emit(CHANGE_EVENT)
        break
      case ActionTypes.REFRESH_FEED_LIST:
        this.feeds = action.feeds
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

  get feeds() {
    const feeds = Object.keys(this._feeds).map(id => this._feeds[id])
    return feeds
  }

  set feeds(newFeeds) {
    this._feeds = {}
    newFeeds.map(feed => this._addFeed(feed))
  }
}

module.exports = new FeedStore()