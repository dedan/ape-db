import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
const storage = require('electron-json-storage');
import {settingsInitialState} from 'reducers/settings'
import watch from 'watch'
import {addFile, loadCatalog} from 'actions/actions'


storage.get('settings', function(error, data) {
  if (error) throw error;

  const initialState = {
    settings: Object.keys(data).length ? data : settingsInitialState,
  }

  const store = configureStore(initialState);

  if (initialState.settings.path) {
    store.dispatch(loadCatalog(initialState.settings.path))
  }

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

