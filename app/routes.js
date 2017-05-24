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

import {Component} from 'react'
import {EntryForm} from 'components/EntryForm'
import fs from 'fs-extra'
class FormDebugger extends Component {

  handleFormSubmit = ({schema, formData}) => {
    // TODO: Store form at basePath/book/page/entryNumber_formCode.json
    console.log('>>', schema, formData)
  }

  render() {
    const currentEntry = {
      path: "/Users/dedan/projects/monkey-db/test/test-folder/OU.Adul.F.1.1998/p004/E0004_N-AR.json",
      entryNumber: "E0004",
      form: "N-AR",
      entryId: "E0004_N-AR",
    }
    const currentEntryData = fs.readJsonSync(currentEntry.path)
    return <div style={{padding: '0 50px'}}>
      <EntryForm
          currentEntry={currentEntry}
          currentEntryData={currentEntryData} />
    </div>
  }
}
