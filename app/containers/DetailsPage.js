import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import path from 'path'
import ReactImageZoom from 'react-image-zoom';
import Form from "react-jsonschema-form"
import fs from 'fs-extra'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import _ from 'underscore'
import {getSchema} from '../store/schema'

class DetailsPage extends Component {

  state = {
    currentEntry: null,
    currentEntryData: null,
  }

  handleFormSubmit = ({schema, formData}) => {
    const {currentEntry} = this.state
    fs.writeJsonSync(currentEntry.path, formData)
  }

  handleEntryClick = entryId => {
    const currentEntry = this.props.pageEntries[entryId]
    const currentEntryData = fs.readJsonSync(currentEntry.path)
    const schema = getSchema(currentEntry.form)
    this.setState({currentEntry, currentEntryData, schema})
  }

  render() {
    const {basePath, currentPage, pageEntries} = this.props
    const {currentEntryData, schema} = this.state
    const imagePath = [basePath, currentPage]
    return (
      <div>
        <h1>The details</h1>
        <Link to="/">
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        <div style={{height: 400}}>
          <ReactImageZoom
              width={400} height={400} zoomWidth={500}
              offset={{vertical: 0, horizontal: 10}}
              img={'file://' + currentPage.original} />
        </div>
        <br />
        <div style={{display: 'flex'}}>
          <List style={{width: 300}}>
            {_.map(pageEntries, entry => {
              return <ListItem
                  onClick={() => this.handleEntryClick(entry.entryId)}
                  key={entry.entryId}
                  primaryText={entry.entryNumber} />
            })}
          </List>
          {currentEntryData ?
            <Form
                schema={schema}
                formData={currentEntryData}
                onSubmit={this.handleFormSubmit} />
            : null}
        </div>
      </div>
    );
  }
}

class FormComponent extends Component {


}

class NewEntryDialog extends Component {

  render() {
    const {isOpen} = this.props
    return (
      <Dialog title="New Entry" modal={true} open={isOpen}>
      </Dialog>
    );

  }
}

function mapStateToProps(state, ownProps) {
  const {book, page} = ownProps.match.params
  const {books, entries} = state.catalog
  const currentPage = books[book][page]
  const pageEntries = _.pick(entries, currentPage.entries)
  return {
    currentPage,
    pageEntries,
    basePath: state.settings.path,
    book,
    page,
  }
}

export default connect(mapStateToProps)(DetailsPage)
