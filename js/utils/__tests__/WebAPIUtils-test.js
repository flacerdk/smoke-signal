import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fetchMock from 'fetch-mock'
import WebAPIUtils from '../WebAPIUtils'

chai.use(chaiAsPromised)
chai.should()

const feedList = {
  _embedded: {
    feeds: [
      {
        id: 1,
        title: 'Test feed 1',
        url: 'http://example.com/test_feed_1',
      },
      {
        id: 2,
        title: 'Test feed 2',
        url: 'http://example.com/test_feed_2',
      },
    ],
  },
}

const entryList = {
  _embedded: {
    entries: [
      {
        id: 1,
        feed_id: 1,
        title: 'Test title 1',
        url: 'http://example.com/test_url_1',
        text: 'Test text 1',
        read: false,
        marked: false,
      },
      {
        id: 2,
        feed_id: 2,
        title: 'Test title 2',
        url: 'http://example.com/test_url_2',
        text: 'Test text 2',
        read: false,
        marked: false,
      },
    ],
  },
}

describe('WebAPIUtils', function () {
  beforeEach(function () {
    fetchMock.get('/feeds/', function () {
      return { _embedded: { feeds: [] } }
    })

    fetchMock.post('/feeds/1', function () {
      const newEntry = {
        id: 3,
        feed_id: 1,
        title: 'Test title 3',
        url: 'http://example.com/test_url_3',
        text: 'Test text 3',
        read: false,
        marked: false,
      }
      entryList._embedded.entries.push(newEntry)
      const entries = entryList._embedded.entries.filter(e => e.feed_id === 1)
      return { _embedded: { entries } }
    })

    fetchMock.get('/feeds/1/all', function () {
      return entryList._embedded.entries[0]
    })

    fetchMock.get('/feeds/all', function () {
      return entryList
    })
  })

  afterEach(function () {
    fetchMock.restore()
  })

  it('gets empty feed list', function () {
    return WebAPIUtils.getFeedList()
      .then(r => r._embedded.feeds)
      .should.eventually.have.length(0)
  })

  it('fetches feed entries', function () {
    return WebAPIUtils.fetchFeedEntries(1)
      .should.eventually.become(entryList._embedded.entries[0])
  })

  it('fetches all entries', function () {
    return WebAPIUtils.fetchEntries('all')
      .should.eventually.become(entryList)
  })

  it('refreshes feed', function () {
    return WebAPIUtils.refreshFeed(1)
      .then(r => r._embedded.entries)
      .should.eventually.have.length(2)
  })
})
