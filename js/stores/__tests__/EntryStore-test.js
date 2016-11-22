import chai from 'chai'
import sinon from 'sinon'

chai.should()

describe('EntryStore', function () {
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const EntryStore = require('../EntryStore')
  const ActionTypes = require('../../constants/FeedReaderConstants')

  const actionFetchFeedEntries = {
    type: ActionTypes.GET_ENTRY_LIST,
    feedId: 1,
    entries: [
      {
        id: 1,
        title: 'Test title',
        url: 'http://example.com/test_url',
        text: 'Test text',
      },
    ],
  }

  let spy
  let callback
  let entryStore

  beforeEach(function () {
    spy = sinon.spy(ActionDispatcher, 'register')
    entryStore = new EntryStore()
    callback = ActionDispatcher.register.getCall(0).args[0]
  })

  afterEach(function () {
    ActionDispatcher.register.restore()
  })

  it('registers a callback with the dispatcher', function () {
    sinon.assert.calledOnce(spy)
  })

  it('initializes with no entries', function () {
    const entries = entryStore.entries
    return entries.should.be.empty
  })

  it('fetches a feed\'s entries', function () {
    callback(actionFetchFeedEntries)
    const entries = entryStore.entries
    entries.length.should.equal(1)
    entries[0].id.should.equal(1)
    entries[0].title.should.equal('Test title')
    entries[0].url.should.to.equal('http://example.com/test_url')
    entries[0].text.should.to.equal('Test text')
  })
})
