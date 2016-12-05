import React from 'react'
import { Grid, Col, Row, Navbar } from 'react-bootstrap/lib'
import AddFeedForm from './AddFeedForm'
import FeedList from './FeedList'
import NavList from './NavList'
import EntryList from './EntryList'
import Entry from './Entry'
import FeedStore from '../stores/FeedStore'
import EntryStore from '../stores/EntryStore'
import FeedPageHeader from './FeedPageHeader'
import FeedListActions from '../actions/FeedListActions'
import EntryListActions from '../actions/EntryListActions'
import Predicates from '../constants/Predicates'
import EmptyPage from './EmptyPage'

export default class FeedPage extends React.Component {
  constructor() {
    super()

    this._feedStore = new FeedStore()
    this._entryStore = new EntryStore()

    this.getStateFromStores = this.getStateFromStores.bind(this)
    this.state = this.getStateFromStores()
    this._onChange = this._onChange.bind(this)
    this._headerAction = this.headerAction.bind(this)
  }

  componentDidMount() {
    this._feedStore.addChangeListener(this._onChange)
    this._entryStore.addChangeListener(this._onChange)
    EntryListActions.fetchEntries('all')
  }

  componentWillUnmount() {
    this._feedStore.removeChangeListener(this._onChange)
    this._entryStore.removeChangeListener(this._onChange)
  }

  getStateFromStores() {
    return {
      feeds: this._feedStore.feeds,
      entries: this._entryStore.entries,
      activeEntry: this._entryStore.activeEntry,
      activeFeed: this._feedStore.activeFeed,
      next: this._entryStore.next,
      predicate: this._entryStore.predicate,
    }
  }

  headerAction() {
    if (typeof this.state.activeFeed !== 'undefined') {
      FeedListActions.deleteFeed(this.state.activeFeed)
      EntryListActions.fetchEntries('all')
    }
    return undefined
  }

  _onChange() {
    this.setState(this.getStateFromStores())
  }

  render() {
    let feedPageHeader = null
    if (this.state.feeds.length === 0) {
      feedPageHeader = (<EmptyPage />)
    } else if (typeof this.state.activeFeed !== 'undefined') {
      const title = this.state.activeFeed.title
      const action = {
        text: 'Unsubscribe',
        onClick: this._headerAction,
      }
      feedPageHeader = (
        <div>
          <FeedPageHeader title={title} action={action} />
        </div>
      )
    } else {
      const predicate = Predicates[this.state.predicate]
      feedPageHeader = (<FeedPageHeader title={predicate} />)
    }

    const entriesColumn = (
      <div>
        <Row>
          {feedPageHeader}
        </Row>
        <Row>
          <EntryList
            entries={this.state.entries}
            activeEntry={this.state.activeEntry}
            next={this.state.next}
          />
        </Row>
      </div>)

    let activeEntry = ''
    if (typeof this.state.activeEntry !== 'undefined'
        && this.state.activeEntry.id !== 0) {
      activeEntry = (
        <Entry
          title={this.state.activeEntry.title}
          url={this.state.activeEntry.url}
          text={this.state.activeEntry.text}
        />
      )
    }
    return (
      <div id="feed_page">
        <Grid fluid>
          <Row>
            <Navbar>
            <AddFeedForm />
            <NavList />
            </Navbar>
          </Row>
          <Row>
            <Col lg={3} md={3}>
              <FeedList
                feeds={this.state.feeds}
                activeFeed={this.state.activeFeed}
              />
            </Col>
            <Col lg={9} md={9}>
              {entriesColumn}
              <Row>{activeEntry}</Row>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
