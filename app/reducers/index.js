// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import settings from './settings';

const rootReducer = combineReducers({
  counter,
  router,
  settings,
});

export default rootReducer;
