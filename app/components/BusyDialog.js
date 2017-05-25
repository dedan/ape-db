import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';

class SettingsDialog extends Component {
  props: {
    isOpen: boolean,
  }

  render() {
    const {isOpen} = this.props

    return (
      <Dialog title="Hardcore validation going on!" modal={true} open={isOpen}>
        <div style={{display: 'flex', justifyContent: 'center', padding: 20}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      </Dialog>
    );
  }
}

export default SettingsDialog;
