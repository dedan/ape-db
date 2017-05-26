import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import path from 'path'
import ReactImageZoom from 'react-image-zoom';
import fs from 'fs-extra'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import _ from 'underscore'
import {EntryForm} from '../components/EntryForm'
import {NewEntryDialog} from '../components/NewEntryDialog'
import {addNewEntry, updateEntry} from '../actions/actions'
import {grey300} from 'material-ui/styles/colors';

class DetailsPage extends Component {

  state = {
    currentEntryData: null,
  }

  handleFormSubmit = ({formData}) => {
    const {currentEntry, dispatch} = this.props
    dispatch(updateEntry(currentEntry.entryId, {isPlaceholder: false}))
    formData.isPlaceholder = false
    fs.writeJsonSync(currentEntry.path, formData)
  }

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.currentEntry === oldProps.currentEntry) {
      return
    }
    this.loadFormData(nextProps.currentEntry)
  }

  componentWillMount() {
    const {currentEntry} = this.props
    currentEntry && this.loadFormData(currentEntry)
  }

  loadFormData = currentEntry => {
    const currentEntryData = fs.readJsonSync(currentEntry.path)
    this.setState({currentEntryData})
  }

  render() {
    const {basePath, currentEntry, currentPage, dispatch, pageEntries, book, page} = this.props
    const {currentEntryData} = this.state
    const imagePath = [basePath, currentPage]
    const headerStyle = {
      position: 'absolute',
      top: 0,
      height: 400,
    }
    const mainStyle = {
      top: 400,
      bottom: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      display: 'flex',
    }
    return (
      <div>
        <div style={headerStyle}>
          <h2>{book} - {page}</h2>
          <Link to={`/${book}`}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
          <ReactImageZoom
              width={400} height={300} zoomWidth={500}
              offset={{vertical: 0, horizontal: 10}}
              img={'file://' + currentPage.original} />
        </div>
        <div style={mainStyle}>
          <div style={{paddingRight: 20, overflowY: 'scroll'}}>
            <List>
              {_.map(pageEntries, entry => {
                const url = `/current-page/${book}/${page}/${entry.entryId}`
                const backgroundColor = currentEntry && entry.entryId === currentEntry.entryId ? grey300 : null
                return <Link to={url} key={entry.entryId}>
                  <ListItem
                      style={{backgroundColor}}
                      primaryText={`${entry.entryNumber} - ${entry.form}`} />
                </Link>
              })}
            </List>
          </div>
          <div style={{flex: 1, overflowY: 'scroll'}}>
            <EntryForm
                currentEntry={currentEntry}
                currentEntryData={currentEntryData}
                onSubmit={this.handleFormSubmit} />
          </div>
        </div>
        <NewEntryDialog
            basePath={basePath} book={book} page={page}
            onNewEntryCreated={entry => dispatch(addNewEntry(book, page, entry))} />
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const {book, page, entryId} = ownProps.match.params
  const {books, entries} = state.catalog
  const currentPage = books[book][page]
  const currentEntry = entries[entryId]
  const pageEntries = _.pick(entries, currentPage.entries)
  return {
    currentPage,
    currentEntry,
    pageEntries,
    basePath: state.settings.path,
    book,
    page,
    entryId,
  }
}

export default connect(mapStateToProps)(DetailsPage)
