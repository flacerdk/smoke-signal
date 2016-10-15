import React from 'react';

var AddFeedForm = React.createClass({
    getInitialState: function() {
        return { url: '' }
    },

    handleUrlChange: function(event) {
        this.setState({url: event.target.value})
    },

    handleSubmit: function(event) {
        event.preventDefault();
        var url = this.state.url.trim();
        if (!url) {
            return;
        }
        this.props.onAddFeed({url: url});
        this.setState({url: ''});
    },

    render: function() {
        return (
            <form className="AddFeedForm" onSubmit={this.handleSubmit}>
                <input type="text"
                       placeholder="URL..."
                       value={this.state.url}
                       onChange={this.handleUrlChange} />
                <input type="submit" value="Add feed"/>
            </form>
        );
    },

});

module.exports = AddFeedForm;