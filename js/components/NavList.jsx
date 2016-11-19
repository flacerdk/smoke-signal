import React from 'react'
import FeedReaderActions from '../actions/FeedReaderActions'

const NavList = () => {
  const predicates = ['all', 'read', 'unread', 'marked']
  const elements = predicates.map((p, i) => {
    const onClick = FeedReaderActions.fetchEntries.bind(null, p)
    const link = `#/feeds/${p}`
    return (
      <li key={i}><a href={link} onClick={onClick}>{p}</a></li>
    )
  })
  return (
    <ul id="nav_list">
      {elements}
    </ul>
  )
}

module.exports = NavList
