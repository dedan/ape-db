/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import DetailsPage from './containers/DetailsPage';

export default () => (
  <Router>
    <App>
      <Switch>
        <Route path="/current-page/:book/:page/:entryId" component={DetailsPage} />
        <Route path="/current-page/:book/:page" component={DetailsPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </App>
  </Router>
);
