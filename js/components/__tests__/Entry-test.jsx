import React from 'react'
import { shallow } from 'enzyme'
import chai from 'chai'

import Entry from '../Entry'

chai.should()

describe('<Entry />', function () {
  it('has read class when read', function () {
    const wrapper = shallow(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
        read
      />)
    wrapper.find('div.read').should.have.length(1)
    wrapper.find('div.unread').should.have.length(0)
  })

  it('has unread class when unread', function () {
    const wrapper = shallow(
      <Entry
        text="Test text"
        title="Test title"
        url="http://example.com/test_url"
        unread
      />)
    wrapper.find('div.unread').should.have.length(1)
    wrapper.find('div.read').should.have.length(0)
  })

})
