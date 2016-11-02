import FeedReaderActions from '../actions/feed_reader_actions.js'
import Mousetrap from 'mousetrap'

export default function() {
  Mousetrap.bind('j', () => FeedReaderActions.scroll(1))
  Mousetrap.bind('k', () => FeedReaderActions.scroll(-1))
}
