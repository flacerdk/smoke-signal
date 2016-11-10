import React from 'react'
import Entry from '../Entry'
import renderer from 'react-test-renderer'

describe('Entry', () => {
  it('has read class when read', () => {
    const component = renderer.create(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
        read
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has unread class when unread', () => {
    const component = renderer.create(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
