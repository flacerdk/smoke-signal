import React from 'react'
import { Button, Form, Navbar, FormControl, FormGroup } from 'react-bootstrap/lib'
import FeedListActions from '../actions/FeedListActions'

export default class AddFeedForm extends React.Component {
  constructor() {
    super()

    this.state = {
      url: '',
      error: false,
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
    .catch(() => this.setState({ error: true }))
  }

  render() {
    const validationState = this.state.error ? 'error' : null
    return (
      <Navbar.Form pullLeft>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup validationState={validationState}>
            <FormControl
              type="text"
              placeholder="URL..."
              value={this.state.url}
              onChange={this.handleUrlChange}
            />
          </FormGroup>
          <Button type="submit">Add feed</Button>
        </Form>
      </Navbar.Form>
    )
  }
}

AddFeedForm.propTypes = {
  onSubmit: React.PropTypes.func,
}
