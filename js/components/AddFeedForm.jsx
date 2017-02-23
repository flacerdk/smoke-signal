import React from 'react'
import FeedListActions from '../actions/FeedListActions'

require('../styles/add-feed-form.scss')

export default class AddFeedForm extends React.Component {
  constructor() {
    super()

    this.state = {
      url: '',
      error: null,
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
    .catch(() => this.setState({ error: 'error' }))
  }

  render() {
    return (
      <form className="add-feed-form" onSubmit={this.handleSubmit}>
        <input
          id="add_feed"
          type="text"
          placeholder="URL..."
          value={this.state.url}
          onChange={this.handleUrlChange}
        />
        <button type="submit">Add feed</button>
      </form>
    )
  }
}

AddFeedForm.propTypes = {
  onSubmit: React.PropTypes.func,
}
