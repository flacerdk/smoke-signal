import EventEmitter from 'events'
import ActionDispatcher from '../dispatcher/action_dispatcher.js'
import ActionTypes from '../constants/feed_reader_constants.js'

const CHANGE_EVENT = 'FeedStore.CHANGE_EVENT'

let _feeds = {}
let _activeFeedId;

let _addFeed = (feed) => {
  if (!_feeds[feed.id]) {
    _feeds[feed.id] = feed
  }
}

let _refreshFeedEntries = (feedId, newEntries) => {
  if (!_feeds[feedId]) {
    return;
  }
  _feeds[feedId].entries = newEntries;
  _activeFeedId = feedId;
}

let _getActiveFeedEntries = () => {
  if (_activeFeedId) {
    return _feeds[_activeFeedId].entries
  } else {
    return []
  }
}

class FeedStore extends EventEmitter {
  constructor() {
    super();

    this.addChangeListener = this.addChangeListener.bind(this);
    this.removeChangeListener = this.removeChangeListener.bind(this);
    this.dispatchToken = ActionDispatcher.register((action) => {
      switch (action.type) {
      case ActionTypes.ADD_FEED:
        _addFeed(action.feed);
        this.emit(CHANGE_EVENT);
        break;
      case ActionTypes.FETCH_FEED_ENTRIES:
        _refreshFeedEntries(action.feedId, action.entries);
        _getActiveFeedEntries();
        this.emit(CHANGE_EVENT);
        break;
      case ActionTypes.REFRESH_FEED_LIST:
        _feeds = {};
        action.feeds.map((feed) => _addFeed(feed));
        this.emit(CHANGE_EVENT);
        break;
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

  getAllFeeds() {
    const feeds = Object.keys(_feeds).map(id => _feeds[id]);
    return feeds
  }

  getActiveFeedEntries() {
    return _getActiveFeedEntries()
  }
}

module.exports = new FeedStore()
