import React from 'react'
import FeedList from './FeedList'
import NavList from './NavList'

const Sidebar = (props) =>
  (
    <div id="sidebar">
      <NavList />
      <FeedList
        feeds={props.feeds}
        activeFeed={props.activeFeed}
      />
    </div>
  )

Sidebar.propTypes = {
  feeds: React.PropTypes.arrayOf(React.PropTypes.object),
  activeFeed: React.PropTypes.shape({
    id: React.PropTypes.number,
    title: React.PropTypes.string,
    unread: React.PropTypes.number,
  }),
}

module.exports = Sidebar
