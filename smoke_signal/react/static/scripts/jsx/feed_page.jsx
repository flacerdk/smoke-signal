import React from 'react';
import ReactDOM from 'react-dom';
import AddFeedForm from './add_feed_form.jsx';
import FeedList from './feed_list.jsx';
import EntryList from './entry_list.jsx';

function getRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            callback(data);
        } else {
            console.error(url, request.responseText);
        }
    }
    request.onerror = function() {
        console.error(url);
    }
    request.send();
};

function postRequest(url, data, callback) {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            callback(data);
        } else {
            console.error(url, request.responseText);
        }
    }
    request.onerror = function() {
        console.error(url);
    }
    request.send(data);
}

var FeedPage = React.createClass({
    getInitialState: function() {
        return { feeds: [], entries: [] };
    },

    handleFeedListRefresh: function() {
        getRequest(this.props.url, function(feeds) {
            this.setState({feeds: feeds});
        }.bind(this));
    },

    handleFeedRefresh: function(feed) {
        getRequest('/get_feed/' + feed.id, function(entries) {
                this.setState({entries: entries});
            }.bind(this));
    },

    handleAddFeed: function(url) {
        postRequest('/add_feed', url, function(feed) {
                var newFeeds = this.state.feeds.concat([feed]);
                this.setState({feeds: newFeeds});
            }.bind(this));
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
