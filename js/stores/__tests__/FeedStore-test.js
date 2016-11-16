'use strict'

const expect = require('chai').expect
const sinon = require('sinon')

describe('FeedStore', function() {
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
    type: ActionTypes.REFRESH_FEED_LIST,
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

  beforeEach(function() {
    spy = sinon.spy(ActionDispatcher, 'register')
    feedStore = new FeedStore()
    callback = ActionDispatcher.register.getCall(0).args[0]
  })

  afterEach(function() {
    ActionDispatcher.register.restore()
  })

  it('registers a callback with the dispatcher', function() {
    sinon.assert.calledOnce(spy)
  })

  it('initializes with no feeds', function() {
    const feeds = feedStore.feeds
    expect(feeds).to.be.empty
  })

  it('adds a feed', function() {
    callback(actionAddFeed)
    const feeds = feedStore.feeds
    expect(feeds.length).to.equal(1)
    expect(feeds[0].id).to.equal(1)
    expect(feeds[0].title).to.equal('Test title')
    expect(feeds[0].url).to.equal('http://example.com/test_url')
  })

  it('refreshes the feed list', () => {
    callback(actionRefreshFeedList)
    const feeds = feedStore.feeds
    expect(feeds.length).to.equal(2)

    expect(feeds[0].id).to.equal(1)
    expect(feeds[0].title).to.equal('Test title 1')
    expect(feeds[0].url).to.equal('http://example.com/test_url_1')
    expect(feeds[1].id).to.equal(2)
    expect(feeds[1].title).to.equal('Test title 2')
    expect(feeds[1].url).to.equal('http://example.com/test_url_2')
  })
})
