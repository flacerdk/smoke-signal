var FeedList = React.createClass({
    getInitialState: function() {
        return { feeds: []};
    },

    handleFeedRefresh: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(feeds) {
                this.setState({feeds: feeds});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.handleFeedRefresh();
        setInterval(this.handleFeedRefresh, this.props.pollInterval);
    },

    render: function() {
        var feeds = this.state.feeds.map(function(feed) {
            return (
                <li className="feed">
                    <a className="feed" href="{feed.url}">{feed.title}</a>
                </li>
            );
        });
        return (
            <div id="feeds"><ul className="feed_list">{feeds}</ul></div>
        );
    },
});


ReactDOM.render(
    <FeedList url="/get_feed_list" pollInterval={5000}/>,
    document.getElementById('container')
);
