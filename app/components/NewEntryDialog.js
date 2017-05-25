import React, { Component } from 'react';
import path from 'path'
import fs from 'fs-extra'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {getFormNames, getSchema} from '../store/schema'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add';


function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}

export class NewEntryDialog extends Component {

  state = {
    isOpen: false,
    entryCreator: 'Stephan',
    entryNumber: '1',
    entryLanguage: 'id',
    entryForm: 'F-BM',
  }

  handleCreateEntryClick = () => {
    const {basePath, book, page, onNewEntryCreated} = this.props
    const {entryCreator, entryForm, entryNumber, entryLanguage} = this.state
    const schema = getSchema(entryForm)
    const m = /^(\d+)(\w)?$/.exec(entryNumber)
    const entryNumberDigits = m[1]
    const entryNumberChar = m[2] || ''
    const validEntryNumber = 'E' + pad(entryNumberDigits, 4) + entryNumberChar
    const fileEntryId = validEntryNumber + '_' + entryForm
    const entryId = book + '_' + fileEntryId
    const entryPath = [basePath, book, page, fileEntryId].join(path.sep) + '.json'
    const emptyForm = {
      isPlaceholder: true,
      entryCreator,
      entryLanguage,
      entryCreationDate: new Date(),
    }
    _.each(schema.properties, (ref, key) => {
      emptyForm[key] = ''
    })
    fs.writeJsonSync(entryPath, emptyForm)
    const newEntry = {
      path: entryPath,
      form: entryForm,
      entryNumber: validEntryNumber,
      isPlaceholder: true,
      entryId
    }
    onNewEntryCreated && onNewEntryCreated(newEntry)
    this.setState({
      isOpen: false,
      entryCreator: '',
      entryNumber: '',
      entryLanguage: '',
      entryForm: '',
    })
  }

  render() {
    const {entryCreator, entryForm, entryNumber, isOpen, entryLanguage} = this.state
    const style = {
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 2,
    }
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={() => this.setState({isOpen: false})}
      />,
      <FlatButton
        label="Create"
        primary={true}
        disabled={!entryCreator || !entryNumber || !entryLanguage || !entryForm}
        onClick={this.handleCreateEntryClick}
      />,
    ]
    return (
      <div style={style}>
        <FloatingActionButton onClick={() => this.setState({isOpen: true})}>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog title="New Entry" actions={actions} modal={true} open={isOpen}>
          <TextField
              value={entryCreator}
              floatingLabelText="Your name"
              onChange={(e, value) => this.setState({['entryCreator']: value})} />
          <br />
          <TextField
              value={entryNumber}
              floatingLabelText="Entry Number"
              onChange={(e, value) => this.setState({['entryNumber']: value})} />
          <br />
          <br />
          <br />
          <select
              value={entryLanguage}
              onChange={e => this.setState({['entryLanguage']: e.target.value})}>
            <option />
            <option value="en">English</option>
            <option value="id">Indonesian</option>
          </select>
          <select
              value={entryForm}
              onChange={e => this.setState({['entryForm']: e.target.value})}>
            <option />
            {getFormNames().map(form => {
              return <option key={form} value={form}>{form}</option>
            })}
          </select>
        </Dialog>
      </div>
    )
  }
}
