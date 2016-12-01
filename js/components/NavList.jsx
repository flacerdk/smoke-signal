import React from 'react'
import { Nav, NavItem } from 'react-bootstrap/lib'
import EntryListActions from '../actions/EntryListActions'

const NavList = (props) => {
  const predicates = ['all', 'read', 'unread', 'marked', 'more']
  const handleSelect = (selectedKey) => {
    if (predicates[selectedKey] === 'more') {
      EntryListActions.fetchMoreEntries(props.next)
    } else {
      EntryListActions.fetchEntries(predicates[selectedKey])
    }
  }
  const elements = predicates.map((p, i) => {
    const link = `#/api/entry/${p}`
    return (
      <NavItem eventKey={i} href={link}>{p}</NavItem>
    )
  })
  return (
    <Nav bsStyle="pills" onSelect={handleSelect}>
      {elements}
    </Nav>
  )
}

module.exports = NavList
