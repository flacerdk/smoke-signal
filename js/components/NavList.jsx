import React from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap/lib'
import EntryListActions from '../actions/EntryListActions'

const NavList = () => {
  const predicates = ['all', 'read', 'unread', 'marked']
  const handleSelect = (selectedKey) => {
    EntryListActions.fetchEntries(predicates[selectedKey])
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
