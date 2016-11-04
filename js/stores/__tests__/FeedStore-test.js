jest.enableAutomock()
jest.dontMock('../FeedStore')

describe('FeedStore', () => {
  const ActionTypes = require('../../constants/FeedReaderConstants')

  let ActionDispatcher
  let FeedStore
  let callback

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

  beforeEach(() => {
    ActionDispatcher = require('../../dispatcher/ActionDispatcher')
    FeedStore = require('../FeedStore.js')

    callback = ActionDispatcher.register.mock.calls[0][0]
  })

  it('registers a callback with the dispatcher', () => {
    expect(ActionDispatcher.register.mock.calls.length).toBe(1)
  })

  it('initializes with no feeds', () => {
    const feeds = FeedStore.feeds
    expect(feeds).toEqual([])
  })

  it('adds a feed', () => {
    callback(actionAddFeed)
    const feeds = FeedStore.feeds
    expect(feeds.length).toBe(1)
    expect(feeds[0].id).toEqual(1)
    expect(feeds[0].title).toEqual('Test title')
    expect(feeds[0].url).toEqual('http://example.com/test_url')
  })

  it('refreshes the feed list', () => {
    callback(actionRefreshFeedList)
    const feeds = FeedStore.feeds
    expect(feeds.length).toBe(2)

    expect(feeds[0].id).toEqual(1)
    expect(feeds[0].title).toEqual('Test title 1')
    expect(feeds[0].url).toEqual('http://example.com/test_url_1')
    expect(feeds[1].id).toEqual(2)
    expect(feeds[1].title).toEqual('Test title 2')
    expect(feeds[1].url).toEqual('http://example.com/test_url_2')
  })
})
