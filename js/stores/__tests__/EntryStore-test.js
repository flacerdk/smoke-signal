import chai from 'chai'
import sinon from 'sinon'

chai.should()

describe('EntryStore', function () {
  const ActionDispatcher = require('../../dispatcher/ActionDispatcher')
  const EntryStore = require('../EntryStore')
  const ActionTypes = require('../../constants/FeedReaderConstants')
  const entry = {
    id: 1,
    title: 'Test title',
    url: 'http://example.com/test_url',
    text: 'Test text',
    read: false,
    marked: false,
  }

  const actionGetEntryList = {
    type: ActionTypes.GET_ENTRY_LIST,
    entries: [entry],
  }

  const changeActiveEntry = {
    type: ActionTypes.CHANGE_ACTIVE_ENTRY,
    entry,
  }

  const changeEntryStatus = () => {
    const newEntry = entry
    newEntry.read = true
    return {
      type: ActionTypes.CHANGE_ENTRY_STATUS,
      entry: newEntry,
    }
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

  it('gets entry list', function () {
    callback(actionGetEntryList)
    const entries = entryStore.entries
    entries.length.should.equal(1)
    entries[0].should.equal(entry)
  })

  it('changes the active entry', function () {
    callback(actionGetEntryList)
    callback(changeActiveEntry)
    const activeEntry = entryStore.activeEntry
    activeEntry.should.equal(entry)
  })

  it('changes the entry\'s status', function () {
    callback(actionGetEntryList)
    callback(changeEntryStatus())
    const entries = entryStore.entries
    entries[0].read.should.equal(true)
    const newEntry = entries[0]
    newEntry.read = false
    newEntry.should.equal(entry)
  })
})
