import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Entry from '../Entry'

describe('<Entry />', function() {
  it('has read class when read', function() {
    const wrapper = shallow(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
        read
      />)
    expect(wrapper.find('div.read')).to.have.length(1)
    expect(wrapper.find('div.unread')).to.have.length(0)
  })

  it('has unread class when unread', function() {
    const wrapper = shallow(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
        unread
      />)
    expect(wrapper.find('div.unread')).to.have.length(1)
    expect(wrapper.find('div.read')).to.have.length(0)
  })

})
