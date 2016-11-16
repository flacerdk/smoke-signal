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
    ],
  },
}

describe('WebAPIUtils', function () {
  beforeEach(function () {
    const requests = this.requests = []
    fetchMock.get('/feeds/', function (url) {
      requests.push(url)
      return feedList
    })
  })

  afterEach(function () {
    fetchMock.restore()
  })

  it('should refresh feed list', function () {
    return WebAPIUtils.refreshFeedList()
      .should.eventually.become(feedList._embedded.feeds)
  })
})
