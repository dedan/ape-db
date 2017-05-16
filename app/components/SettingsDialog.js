// @flow
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

  handlePathClick = () => {
    dialog.showOpenDialog({properties: ['openDirectory']}, fileNames => {
      if(fileNames === undefined){
          console.log("No file selected");
          return;
      }
      this.setState({path: fileNames[0]})
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
        disabled={!this.state.path}
        onClick={this.handleSaveClick}
      />,
    ];
    return (
      <Dialog title="Settings" actions={actions} modal={true} open={isOpen}>
        <RaisedButton
          label={`${settings.path ? 'Change' : 'Select'} the data path`}
          style={{margin: 12}}
          onClick={this.handlePathClick} />
        <TextField
          disabled={true}
          value={this.state.path || ''}
          hintText="No path set" />
        <div>
          Author will be set here later.
        </div>
      </Dialog>
    );
  }
}

export default SettingsDialog;
