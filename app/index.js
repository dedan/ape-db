import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
const storage = require('electron-json-storage');
import {settingsInitialState} from 'reducers/settings'

storage.get('settings', function(error, data) {
  if (error) throw error;

  const initialState = {
    counter: 0,
    settings: Object.keys(data).length ? data : settingsInitialState,
  }

  const store = configureStore(initialState);
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./containers/Root', () => {
      const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
      render(
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
});

