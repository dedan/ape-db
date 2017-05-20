// @flow
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


const schema = fs.readJsonSync('/Users/dedan/projects/monkey-db/test/test-forms/N-BSC.json')

class DetailsPage extends Component {

  handleFormSubmit = ({schema, formData}) => {
    // TODO: Store form at basePath/book/page/entryNumber_formCode.json
    console.log('>>', schema, formData)
  }

  render() {
    const {basePath, currentPage} = this.props
    console.log('>>', currentPage)
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
        <div>
          <Form schema={schema}
                onSubmit={this.handleFormSubmit} />
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
  }
}

export default connect(mapStateToProps)(DetailsPage)
