import React from 'react'
import { importOPML } from '../actions/FeedListActions'

export default class EmptyPage extends React.Component {
  constructor() {
    super()

    this.state = {
      file: {},
      error: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ file: event.target.files[0] })
  }

  handleSubmit(event) {
    event.preventDefault()
    importOPML(this.state.file).catch(() => this.setState({ error: 'error' }))

    this.setState({ file: {} })
  }

  render() {
    const opmlInput = (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="opml_file">Choose an OPML file.</label>
        <input
          id="opml_file"
          type="file"
          onChange={this.handleChange}
        />
        <button type="submit">Import OPML</button>
      </form>
    )

    const message = (
      <div>
        <h1>Hello!</h1>
        <p>Looks like you have no feeds yet. Add a feed or import an OPML file.</p>
        {opmlInput}
      </div>
    )

    return message
  }
}
