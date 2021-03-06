// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app';
import catalog from './catalog';
import settings from './settings';

const rootReducer = combineReducers({
  app,
  catalog,
  router,
  settings,
});

export default rootReducer;
