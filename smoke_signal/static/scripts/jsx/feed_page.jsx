import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import AddFeedForm from './add_feed_form.jsx';
import FeedList from './feed_list.jsx';
import EntryList from './entry_list.jsx';

var FeedPage = React.createClass({
    getInitialState: function() {
        return { feeds: [], entries: [] };
    },

    handleFeedListRefresh: function() {
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

    handleFeedRefresh: function(feed) {
        var url = '/get_feed/' + feed.id;
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(entries) {
                this.setState({entries: entries});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    handleAddFeed: function(url) {
        $.ajax({
            url: '/add_feed',
            dataType: 'json',
            type: 'POST',
            data: url,
            success: function(feed) {
                var newFeeds = this.state.feeds.concat([feed]);
                this.setState({feeds: newFeeds});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/add_feed', status, err.toString());
            }.bind(this)
        })
    },

    componentDidMount: function() {
        this.handleFeedListRefresh();
    },

    render: function() {
        return (
            <div id="feed_page">
                <AddFeedForm onAddFeed={this.handleAddFeed} />
                <FeedList feeds={this.state.feeds} onClick={this.handleFeedRefresh} />
                <EntryList entries={this.state.entries} />
            </div>
        );
    }

});

ReactDOM.render(
    <FeedPage url="/get_feed_list" />,
    document.getElementById('container')
);
