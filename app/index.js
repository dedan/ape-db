import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
const storage = require('electron-json-storage');
import {settingsInitialState} from 'reducers/settings'
import watch from 'watch'
import {addFile} from 'actions/actions'



storage.get('settings', function(error, data) {
  if (error) throw error;

  const initialState = {
    counter: 0,
    settings: Object.keys(data).length ? data : settingsInitialState,
  }

  const store = configureStore(initialState);

  let currentPath
  function fileSystemListener() {
    let previousPath = currentPath
    const {settings} = store.getState()
    currentPath = settings.path
    if (currentPath && currentPath !== previousPath) {
      const pathLength = currentPath.length
      watch.watchTree(currentPath, function (f, curr, prev) {
        if (typeof f == "object" && prev === null && curr === null) {
          // Finished walking the tree
          Object.keys(f).forEach(filePath => {
            const relFilePath = filePath.slice(pathLength + 1)
            store.dispatch(addFile(filePath, relFilePath, f[filePath]))
          })
        } else if (prev === null) {
          // f is a new file
          const relFilePath = f.slice(pathLength + 1)
          store.dispatch(addFile(f, relFilePath, curr))
        }
      })
    }
  }

  store.subscribe(fileSystemListener)

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

