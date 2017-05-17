// TODO: activate flow again
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React, { Component } from 'react';
import type { Children} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import SettingsDialog from '../components/SettingsDialog'
import * as Actions from '../actions/actions'
import type {settingsStateType, actionType} from '../reducers/settings'


class App extends Component {
  props: {
    children: Children,
    settings: settingsStateType,
    setSettings: () => void,
  };

  constructor(props) {
    super(props)
    injectTapEventPlugin();
  }

  render() {
    const {settings, setSettings} = this.props
    return (
      <MuiThemeProvider>
        <div>
          {this.props.children}
          <SettingsDialog
              isOpen={!settings.path} settings={settings}
              onSaveSettings={setSettings} />
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
