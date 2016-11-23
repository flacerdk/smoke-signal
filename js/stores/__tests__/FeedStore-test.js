import chai from 'chai'
import sinon from 'sinon'

chai.should()

describe('FeedStore', function () {
  const ActionTypes = require('../../constants/FeedReaderConstants')
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const FeedStore = require('../FeedStore')
  const feed = {
    id: 1,
    title: 'Test title',
    url: 'http://example.com/test_url',
  }

  const actionAddFeed = {
    type: ActionTypes.ADD_FEED,
    feed,
  }

  const actionRefreshFeedList = {
    type: ActionTypes.GET_FEED_LIST,
    feeds: [feed],
  }

  const actionChangeActiveFeed = {
    type: ActionTypes.CHANGE_ACTIVE_FEED,
    feed,
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
})
