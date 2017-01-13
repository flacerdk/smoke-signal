import React from 'react'
import ReactDOM from 'react-dom'
import FeedPage from './components/FeedPage'
import FeedListActions from './actions/FeedListActions'

require('./style.scss')

FeedListActions.getFeedList()

ReactDOM.render((
  <FeedPage />
), document.getElementById('container'))
