import React from 'react'
import { Button, Form, FormControl } from 'react-bootstrap/lib'
import FeedListActions from '../actions/FeedListActions'

export default class AddFeedForm extends React.Component {
  constructor() {
    super()

    this.state = {
      url: '',
    }

    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleUrlChange(event) {
    this.setState({ url: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const url = this.state.url.trim()
    if (!url) {
      return
    }
    this.setState({ url: '' })
    FeedListActions.addFeed(url)
  }

  render() {
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormControl
          type="text"
          placeholder="URL..."
          value={this.state.url}
          onChange={this.handleUrlChange}
        />
        <Button type="submit">Add feed</Button>
      </Form>
    )
  }
}

AddFeedForm.propTypes = {
  onSubmit: React.PropTypes.func,
}
