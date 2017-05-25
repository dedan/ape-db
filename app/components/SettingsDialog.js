import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
const {dialog} = require('electron').remote;


class SettingsDialog extends Component {
  props: {
    isOpen: boolean,
    settings: {},
  }

  constructor(props) {
    super(props)
    this.state = {...props.settings}
  }

  handlePathClick = variable => () => {
    dialog.showOpenDialog({properties: ['openDirectory']}, fileNames => {
      if(fileNames === undefined){
          console.log("No file selected");
          return;
      }
      this.setState({[variable]: fileNames[0]})
    })
  }

  handleSaveClick = () => {
    this.props.onSaveSettings(this.state)
  }

  render() {
    const {isOpen, settings} = this.props

    const actions = [
      <FlatButton
        label="Save"
        primary={true}
        disabled={!this.state.path || !this.state.formsPath}
        onClick={this.handleSaveClick}
      />,
    ];
    return (
      <Dialog title="Settings" actions={actions} modal={true} open={isOpen}>
        <div>
          Before you can use the application, you have to tell it where to
          find the <b>catalog folder</b> (images and entries) and the folder with
          the <b>form schemata</b>. They should be both in the pcloud folder on your computer.
        </div>
        <br />
        <RaisedButton
          label={`${settings.path ? 'Change' : 'Select'} the catalog path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('path')} />
        <TextField
          disabled={true}
          value={this.state.path || ''}
          hintText="No catalog path set" />
        <RaisedButton
          label={`${settings.formPath ? 'Change' : 'Select'} the forms path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('formsPath')} />
        <TextField
          disabled={true}
          value={this.state.formsPath || ''}
          hintText="No forms path set" />
      </Dialog>
    );
  }
}

export default SettingsDialog;
