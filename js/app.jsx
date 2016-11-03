import React from 'react'
import ReactDOM from 'react-dom'
import FeedPage from './components/FeedPage'
import FeedReaderActions from './actions/FeedReaderActions'

FeedReaderActions.refreshFeedList()

ReactDOM.render((
  <FeedPage />
), document.getElementById('container'))
