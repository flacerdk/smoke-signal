import chai from 'chai'
import sinon from 'sinon'

chai.should()

const mockEntry = (id, feedId) => (
  {
    id,
    title: `Test title ${id}`,
    url: `http://example.com/test_url${id}`,
    text: 'Test text',
    read: false,
    marked: false,
    feed_id: feedId,
  }
)

const mockFeed = (id, entries) => {
  const numEntries = entries.length
  const _links = {
    self: {
      href: `/api/feed/${id}`,
    },
  }
  if (numEntries > 20) {
    _links.next = {
      href: `/api/feed/${id}?page=2`,
    }
  }

  return {
    id,
    title: 'Test title',
    url: 'http://example.com/test_url',
    _embedded: {
      entries,
    },
    _links,
    unread: numEntries,
  }
}

describe('EntryStore', function () {
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const EntryStore = require('../EntryStore')
  const ActionTypes = require('../../constants/FeedReaderConstants')
  const entry = mockEntry(1, 1)
  const secondEntry = mockEntry(2, 1)
  const feed = mockFeed(1, [entry, secondEntry])

  const newFeed = mockFeed(1, [])
  newFeed._embedded.entry = entry
  newFeed._embedded.entry.read = true
  newFeed._embedded.unread = 0

  const entryList = Array(21).fill().map((_, i) => mockEntry(i, 1))
  const largeFeed = mockFeed(1, entryList)

  const actionGetFeed = {
    type: ActionTypes.GET_FEED,
    feed,
  }

  const actionGetEntryList = {
    type: ActionTypes.GET_ENTRY_LIST,
    entries: [entry, secondEntry],
  }

  const actionChangeActiveEntry = {
    type: ActionTypes.CHANGE_ACTIVE_ENTRY,
    entry,
  }

  const actionMarkAllRead = {
    type: ActionTypes.MARK_ALL_READ,
  }

  const actionChangeEntryStatus = () => (
    {
      type: ActionTypes.CHANGE_ENTRY_STATUS,
      feed: newFeed,
    }
  )

  const actionGetLargeFeed = {
    type: ActionTypes.GET_ENTRY_LIST,
    entries: largeFeed._embedded.entries,
    next: largeFeed._links.next.href,
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

  it('gets feed', function () {
    callback(actionGetFeed)
    const entries = entryStore.entries
    entries.length.should.equal(2)
    entries[0].should.equal(entry)
  })

  it('gets entry list', function () {
    callback(actionGetEntryList)
    const entries = entryStore.entries
    entries.length.should.equal(2)
    entries[0].should.equal(entry)
  })

  it('changes the active entry', function () {
    callback(actionGetEntryList)
    callback(actionChangeActiveEntry)
    const activeEntry = entryStore.activeEntry
    activeEntry.should.equal(entry)
  })

  it('changes the entry\'s status', function () {
    callback(actionGetEntryList)
    callback(actionChangeEntryStatus())
    const entries = entryStore.entries
    entries[0].read.should.equal(true)
    const newEntry = entries[0]
    newEntry.read = false
    newEntry.read.should.equal(entry.read)
  })

  it('marks all entries read', function () {
    callback(actionGetEntryList)
    callback(actionMarkAllRead)
    const entries = entryStore.entries
    entries[0].read.should.be.true
    entries[1].read.should.be.true
  })

  it('stores a link to next page', function () {
    callback(actionGetLargeFeed)
    const next = entryStore.next
    next.should.equal(largeFeed._links.next.href)
  })
})
