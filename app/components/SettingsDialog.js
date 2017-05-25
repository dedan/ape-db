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
        <RaisedButton
          label={`${settings.path ? 'Change' : 'Select'} the data path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('path')} />
        <TextField
          disabled={true}
          value={this.state.path || ''}
          hintText="No path set" />
        <RaisedButton
          label={`${settings.formPath ? 'Change' : 'Select'} the forms path`}
          style={{margin: 12}}
          onClick={this.handlePathClick('formsPath')} />
        <TextField
          disabled={true}
          value={this.state.formPath || ''}
          hintText="No forms path set" />
      </Dialog>
    );
  }
}

export default SettingsDialog;
