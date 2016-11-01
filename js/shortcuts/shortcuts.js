import FeedReaderActions from '../actions/feed_reader_actions.js'

module.exports = {
  bindShortcuts: event => {
    if (event.key == 'j') {
      FeedReaderActions.scroll(1)
    } else if (event.key == 'k') {
      FeedReaderActions.scroll(-1)
    }
  }
}
