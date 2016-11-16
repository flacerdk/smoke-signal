'use strict'

const expect = require('chai').expect
const sinon = require('sinon')

describe('EntryStore', function() {
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const EntryStore = require('../EntryStore')
  const ActionTypes = require('../../constants/FeedReaderConstants')

  const actionFetchFeedEntries = {
    type: ActionTypes.FETCH_FEED_ENTRIES,
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

  beforeEach(function() {
    spy = sinon.spy(ActionDispatcher, 'register')
    entryStore = new EntryStore()
    callback = ActionDispatcher.register.getCall(0).args[0]
  })

  afterEach(function() {
    ActionDispatcher.register.restore()
  })

  it('registers a callback with the dispatcher', function() {
    sinon.assert.calledOnce(spy)
  })
  

  it('initializes with no entries', function() {
    const entries = entryStore.entries
    expect(entries).to.be.empty
  })

  it('fetches a feed\'s entries', function() {
    callback(actionFetchFeedEntries)
    const entries = entryStore.entries
    expect(entries.length).to.equal(1)
    expect(entries[0].id).to.equal(1)
    expect(entries[0].title).to.equal('Test title')
    expect(entries[0].url).to.equal('http://example.com/test_url')
    expect(entries[0].text).to.equal('Test text')
  })
})
