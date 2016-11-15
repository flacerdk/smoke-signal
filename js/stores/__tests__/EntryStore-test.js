jest.enableAutomock()
jest.dontMock('../EntryStore')

describe('EntryStore', () => {
  const ActionTypes = require('../../constants/FeedReaderConstants')

  let ActionDispatcher
  let EntryStore
  let callback

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

  beforeEach(() => {
    ActionDispatcher = require('../../dispatcher/ActionDispatcher')
    EntryStore = require('../EntryStore.js')

    callback = ActionDispatcher.register.mock.calls[0][0]
  })

  it('registers a callback with the dispatcher', () => {
    expect(ActionDispatcher.register.mock.calls.length).toBe(1)
  })

  it('initializes with no entries', () => {
    const entries = EntryStore.entries
    expect(entries).toEqual([])
  })

  it('fetches a feed\'s entries', () => {
    callback(actionFetchFeedEntries)
    const entries = EntryStore.entries
    expect(entries.length).toBe(1)
    expect(entries[0].id).toEqual(1)
    expect(entries[0].title).toEqual('Test title')
    expect(entries[0].url).toEqual('http://example.com/test_url')
    expect(entries[0].text).toEqual('Test text')
  })
})
