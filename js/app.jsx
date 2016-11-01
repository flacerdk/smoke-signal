import React from 'react'
import ReactDOM from 'react-dom'
import FeedPage from './components/feed_page.jsx'
import FeedReaderActions from './actions/feed_reader_actions.js'
import { bindShortcuts } from './shortcuts/shortcuts.js'

FeedReaderActions.refreshFeedList();

document.onkeypress = bindShortcuts;

ReactDOM.render((
  <FeedPage />
), document.getElementById('container'));
