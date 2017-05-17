// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import catalog from './catalog';
import counter from './counter';
import settings from './settings';

const rootReducer = combineReducers({
  catalog,
  counter,
  router,
  settings,
});

export default rootReducer;
