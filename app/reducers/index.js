// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import catalog from './catalog';
import settings from './settings';

const rootReducer = combineReducers({
  catalog,
  router,
  settings,
});

export default rootReducer;
