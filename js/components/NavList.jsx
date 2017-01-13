import React from 'react'
import EntryListActions from '../actions/EntryListActions'

const NavList = () => {
  const predicates = ['all', 'read', 'unread', 'marked']
  const handleSelect = (selectedKey) => {
    EntryListActions.fetchEntries(predicates[selectedKey])
  }
  const elements = predicates.map((p, i) => {
    const link = `#/api/entry/${p}`
    const onClick = () => handleSelect(i)
    return (
      <li key={i}>
        <a href={link} onClick={onClick}>{p}</a>
      </li>
    )
  })
  return (
    <ul className="nav">
      {elements}
    </ul>
  )
}

module.exports = NavList
