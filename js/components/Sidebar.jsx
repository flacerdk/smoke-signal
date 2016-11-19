import React from 'react'
import FeedList from './FeedList'
import NavList from './NavList'

const Sidebar = (props) => {
  return (
    <div id="sidebar">
      <NavList />
      <FeedList feeds={props.feeds} />
    </div>
  )
}

Sidebar.propTypes = {
  feeds: React.PropTypes.arrayOf(React.PropTypes.object),
}

module.exports = Sidebar
