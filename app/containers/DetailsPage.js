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
    currentEntryData: null,
  }

  handleFormSubmit = ({schema, formData}) => {
    const {currentEntry} = this.props
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
    const {basePath, currentEntry, currentPage, pageEntries, book, page} = this.props
    const {currentEntryData} = this.state
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
              const url = `/current-page/${book}/${page}/${entry.entryId}`
              return <Link to={url} key={entry.entryId}>
                <ListItem primaryText={entry.entryNumber} />
              </Link>
            })}
          </List>
          <div style={{paddingRight: 50}}>
            <EntryForm
                currentEntry={currentEntry}
                currentEntryData={currentEntryData} />
          </div>
        </div>
      </div>
    );
  }
}

class EntryForm extends Component {

  render() {
    const {currentEntry, currentEntryData} = this.props
    const schema = getSchema(currentEntry.form)
    if (!currentEntry && currentEntryData) {
      return
    }
    const uiSchema = {}
    schema && _.each(schema.properties, (ref, key) => {
      const splitRef = ref['$ref'].split('/')
      const def = schema.definitions[splitRef.pop()]
      const shouldBeRadio = def.enum && def.enum.length < 4
      if (shouldBeRadio) {
        uiSchema[key] = {"ui:widget": "radio"}
      }
    })
    return <div>
      {currentEntry.entryId}
      <Form
          uiSchema={uiSchema}
          schema={schema}
          formData={currentEntryData}
          onSubmit={this.handleFormSubmit} />
    </div>
  }
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
