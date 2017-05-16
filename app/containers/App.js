// @flow
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React, { Component } from 'react';
import type { Children } from 'react';
import {connect} from 'react-redux';
import SettingsDialog from '../components/SettingsDialog'
import {setSettings} from '../actions/actions'


class App extends Component {
  props: {
    children: Children,
  };

  constructor(props) {
    super(props)
    injectTapEventPlugin();
  }

  handleSaveSettings = settings => {
    this.props.dispatch(setSettings(settings))
  }

  render() {
    const {settings} = this.props
    return (
      <MuiThemeProvider>
        <div>
          {this.props.children}
          <SettingsDialog
              isOpen={!settings.path} settings={settings}
              onSaveSettings={this.handleSaveSettings} />
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  }
}

export default connect(mapStateToProps)(App)
