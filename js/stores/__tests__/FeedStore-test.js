import chai from 'chai'
import sinon from 'sinon'

chai.should()

describe('FeedStore', function () {
  const ActionTypes = require('../../constants/FeedReaderConstants')
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const FeedStore = require('../FeedStore')

  const actionAddFeed = {
    type: ActionTypes.ADD_FEED,
    newFeed: {
      id: 1,
      title: 'Test title',
      url: 'http://example.com/test_url',
    },
  }

  const actionRefreshFeedList = {
    type: ActionTypes.GET_FEED_LIST,
    feeds: [
      {
        id: 1,
        title: 'Test title 1',
        url: 'http://example.com/test_url_1',
      },
      {
        id: 2,
        title: 'Test title 2',
        url: 'http://example.com/test_url_2',
      },
    ],
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

  it('adds a feed', function() {
    callback(actionAddFeed)
    const feeds = feedStore.feeds
    feeds.length.should.equal(1)
    feeds[0].id.should.equal(1)
    feeds[0].title.should.equal('Test title')
    feeds[0].url.should.equal('http://example.com/test_url')
  })

  it('refreshes the feed list', () => {
    callback(actionRefreshFeedList)
    const feeds = feedStore.feeds
    feeds.length.should.equal(2)

    feeds[0].id.should.equal(1)
    feeds[0].title.should.equal('Test title 1')
    feeds[0].url.should.equal('http://example.com/test_url_1')
    feeds[1].id.should.equal(2)
    feeds[1].title.should.equal('Test title 2')
    feeds[1].url.should.equal('http://example.com/test_url_2')
  })
})
