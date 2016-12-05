import React from 'react'
import { Button, ControlLabel, FormControl, FormGroup, Jumbotron } from 'react-bootstrap/lib'
import { importOPML } from '../actions/FeedListActions'

export default class EmptyPage extends React.Component {
  constructor() {
    super()

    this.state = {
      file: {},
      error: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ file: event.target.files[0] })
  }

  handleSubmit(event) {
    event.preventDefault()
    importOPML(this.state.file).catch(() => this.setState({ error: true }))

    this.setState({ file: {} })
  }

  render() {
    const opmlInput = (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="opml_file">
          <FormControl
            type="file"
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button type="submit">Import OPML</Button>
      </form>
    )

    const message = (
      <Jumbotron>
        <h1>Hello!</h1>
        <p>Looks like you have no feeds yet. Add a feed or import an OPML file.</p>
        {opmlInput}
      </Jumbotron>
    )

    return message
  }
}
