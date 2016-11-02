import React from 'react'
import ReactDOM from 'react-dom'
import FeedPage from './components/feed_page'
import FeedReaderActions from './actions/feed_reader_actions'

FeedReaderActions.refreshFeedList()

ReactDOM.render((
  <FeedPage />
), document.getElementById('container'))
