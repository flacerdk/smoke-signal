import React from 'react';
import FeedReaderActions from '../actions/FeedReaderActions'

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
    FeedReaderActions.addFeed(url)
  }

  render() {
    return (
      <form className="add_feed_form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="URL..."
          value={this.state.url}
          onChange={this.handleUrlChange}
        />
        <input type="submit" value="Add feed" />
      </form>
    )
  }
}

AddFeedForm.propTypes = {
  onSubmit: React.PropTypes.func,
}
