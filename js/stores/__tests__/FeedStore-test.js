import chai from 'chai'
import sinon from 'sinon'

chai.should()

describe('FeedStore', function () {
  const ActionTypes = require('../../constants/FeedReaderConstants')
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const FeedStore = require('../FeedStore')
  const entry = {
    id: 1,
    feed_id: 1,
    read: false,
  }
  const secondEntry = {
    id: 2,
    feed_id: 1,
    read: false,
  }
  const feed = {
    id: 1,
    title: 'Test title',
    url: 'http://example.com/test_url',
    _embedded: {
      entries: [entry, secondEntry],
    },
    unread: 2,
  }
  const newFeed = {
    id: 1,
    title: 'Test title 2',
    url: 'http://example.com/test_url',
    _embedded: {
      entries: [entry],
    },
    unread: 1,
  }

  const readFeed = {
    id: 1,
    title: 'Test title 2',
    url: 'http://example.com/test_url',
    _embedded: {
      entry: {
        id: 1,
        feed_id: 1,
        read: false,
      },
    },
    unread: 0,
  }

  const unreadFeed = {
    id: 1,
    title: 'Test title 2',
    url: 'http://example.com/test_url',
    _embedded: {
      entry: {
        id: 1,
        feed_id: 1,
        read: true,
      },
    },
    unread: 1,
  }

  const feedList = {
    _embedded: {
      feeds: [feed],
    },
  }

  const actionAddFeed = {
    type: ActionTypes.ADD_FEED,
    feed,
  }

  const actionRefreshFeedList = {
    type: ActionTypes.GET_FEED_LIST,
    feeds: feedList,
  }

  const actionChangeActiveFeed = {
    type: ActionTypes.CHANGE_ACTIVE_FEED,
    feed,
  }

  const actionRefreshFeed = {
    type: ActionTypes.REFRESH_FEED,
    feed: newFeed,
  }

  const actionMakeEntryRead = {
    type: ActionTypes.CHANGE_ENTRY_STATUS,
    feed: readFeed,
  }

  const actionMakeEntryUnread = {
    type: ActionTypes.CHANGE_ENTRY_STATUS,
    feed: unreadFeed,
  }

  const actionMarkAllRead = {
    type: ActionTypes.MARK_ALL_READ,
  }

  let spy
  let callback
  let feedStore

  beforeEach(function () {
    spy = sinon.spy(ActionDispatcher, 'register')
    feedStore = new FeedStore()
    callback = ActionDispatcher.register.getCall(0).args[0]
  })

  afterEach(function () {
    ActionDispatcher.register.restore()
  })

  it('registers a callback with the dispatcher', function () {
    sinon.assert.calledOnce(spy)
  })

  it('initializes with no feeds', function () {
    const feeds = feedStore.feeds
    return feeds.should.be.empty
  })

  it('adds a feed', function () {
    callback(actionAddFeed)
    const feeds = feedStore.feeds
    feeds.length.should.equal(1)
    feeds[0].should.equal(feed)
  })

  it('refreshes a feed', function () {
    callback(actionRefreshFeedList)
    callback(actionRefreshFeed)
    const feeds = feedStore.feeds
    feeds.length.should.equal(1)
    feeds[0].should.equal(newFeed)
  })

  it('refreshes the feed list', function () {
    callback(actionRefreshFeedList)
    const feeds = feedStore.feeds
    feeds.length.should.equal(1)

    feeds[0].should.equal(feed)
  })

  it('changes active feed', function () {
    callback(actionRefreshFeedList)
    callback(actionChangeActiveFeed)
    const activeFeed = feedStore.activeFeed
    activeFeed.should.equal(feed)
  })

  it('changes entry status', function () {
    callback(actionRefreshFeedList)
    callback(actionMakeEntryRead)
    feedStore.feeds[0].unread.should.equal(0)
    callback(actionMakeEntryUnread)
    feedStore.feeds[0].unread.should.equal(1)
  })

  it('marks all entries read', function () {
    callback(actionRefreshFeedList)
    callback(actionMarkAllRead)
    feedStore.feeds[0].unread.should.equal(0)
  })
})
