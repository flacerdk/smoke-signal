import React from 'react'
import EntryListActions from '../actions/EntryListActions'

const NavList = () => {
  const predicates = ['all', 'read', 'unread', 'marked']
  const elements = predicates.map((p, i) => {
    const onClick = EntryListActions.fetchEntries.bind(null, p)
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
