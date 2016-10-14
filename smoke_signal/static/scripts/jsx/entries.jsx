var FetchFeed = React.createClass({
    getInitialState: function() {
        return { entries: []};
    },
    
    handleFeedRefresh: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(entries) {
                this.setState({entries: entries});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    render: function() {
        return (
            <div className="entries">
                <h1>Entries</h1>
                <EntryList entries={this.state.entries} />
            </div>
        );
    }
});

var EntryList = React.createClass({
    render: function() {
        var entries = this.props.entries.map(function(entry) {
            return (
                <div className="entry">
                    <h1>{entry.title}</h1>
                    <p>{entry.text}</p>
                </div>
            );
        });
        return (
            <div className="entryList">{entries}</div>
        );
    },
});

