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

const FORMS_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/'

class DetailsPage extends Component {

  state = {
    currentEntry: null,
    currentEntryData: null,
  }

  handleFormSubmit = ({schema, formData}) => {
    // TODO: Store form at basePath/book/page/entryNumber_formCode.json
    console.log('>>', schema, formData)
  }

  handleEntryClick = entryId => {
    const {entries} = this.props.currentPage
    const currentEntry = entries[entryId]
    const currentEntryData = fs.readJsonSync(currentEntry.path)
    // TODO: Cache schemata.
    const currentEntrySchema = fs.readJsonSync(FORMS_PATH + currentEntry.form + '.json')
    this.setState({currentEntry, currentEntryData, currentEntrySchema})
  }

  render() {
    const {basePath, currentPage} = this.props
    const {currentEntryData, currentEntrySchema} = this.state
    const imagePath = [basePath, currentPage]
    return (
      <div>
        <h1>The details</h1>
        <Link to="/">
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        <div style={{height: 300}}>
          <ReactImageZoom
              width={400} height={250} zoomWidth={400}
              offset={{vertical: 0, horizontal: 10}}
              img={'file://' + currentPage.original} />
        </div>
        <br />
        <div style={{display: 'flex'}}>
          <List style={{width: 300}}>
            {Object.keys(currentPage.entries).map(entryId => {
              return <ListItem
                  onClick={() => this.handleEntryClick(entryId)}
                  key={entryId} primaryText={entryId} />
            })}
          </List>
          {currentEntryData ?
            <Form
                schema={currentEntrySchema}
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
  return {
    currentPage: state.catalog[book][page],
    basePath: state.settings.path,
    book,
    page,
  }
}

export default connect(mapStateToProps)(DetailsPage)
