import React from 'react'

export default class Entry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Trusting that feedparser does proper sanitization here
    let createMarkup =  () => { return { __html: this.props.text } };
    return (
      <div className="entry">
        <a className="entry_title" href={this.props.url}>{this.props.title}</a>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    );
  }
}

Entry.propTypes = {
  title: React.PropTypes.string,
  url: React.PropTypes.string,
  text: React.PropTypes.string
}
