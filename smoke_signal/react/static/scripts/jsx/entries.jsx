var EntryList = React.createClass({
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
        var entries = this.props.entries.map(function(entry) {
            return (
                <div className="entry">
                    <a href="{entry.url}">{entry.title}</a>
                    <p>{entry.text}</p>
                </div>
            );
        });
        return (
            <div className="entries">
                {entries}
            </div>
        );
    }
});

ReactDOM.render(
    <EntryList />,
    document.getElementById('entries_container')
);
