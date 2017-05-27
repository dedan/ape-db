import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
const {dialog} = require('electron').remote;
import {amber300} from 'material-ui/styles/colors'


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
    const {isCatalogPathInvalid, isFormsPathInvalid, isOpen, settings} = this.props
    const warningStyle = {
      marginTop: 20,
      backgroundColor: amber300,
      padding: 15,
    }
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
        {isCatalogPathInvalid || isFormsPathInvalid ? <div style={warningStyle}>
            One of the two folders could not be found.
            Please set <b>both of them</b> again.
          </div> :null}
        <br />
        <RaisedButton
          label={`${settings.path ? 'Change' : 'Select'} the catalog path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('path')} />
        <br />
        <TextField
          fullWidth={true}
          disabled={true}
          value={this.state.path || settings.path}
          hintText="No catalog path set"
          errorText={isCatalogPathInvalid && !this.state.path ? 'Invalid path' : null} />
        <br />
        <RaisedButton
          label={`${settings.formPath ? 'Change' : 'Select'} the forms path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('formsPath')} />
        <br />
        <TextField
          fullWidth={true}
          disabled={true}
          value={this.state.formsPath || settings.formsPath}
          hintText="No forms path set"
          errorText={isFormsPathInvalid && !this.state.formsPath ? 'Invalid path' : null} />
      </Dialog>
    );
  }
}

export default SettingsDialog;
