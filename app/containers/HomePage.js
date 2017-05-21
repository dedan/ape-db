// @flow
import React, { Component } from 'react';
import {connect} from 'react-redux'
import path from 'path'
import Catalog from '../components/Catalog';
import FileAdder from '../components/FileAdder';
import {addFile} from '../actions/actions'
import {getAllPages} from '../selectors/catalog'

class HomePage extends Component {

  handleFileCopied = relFilePath => {
    const {dispatch, settings} = this.props
    const fakeFstat = {
      isDirectory: () => false
    }
    const absPath = [settings.path, relFilePath].join(path.sep)
    dispatch(addFile(absPath, relFilePath, fakeFstat))
  }

  render() {
    const {allPages, entries, settings} = this.props
    return (
      <div>
        <FileAdder
            basePath={settings.path}
            onFileCopied={this.handleFileCopied} />
        <Catalog allPages={allPages} entries={entries} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {settings} = state
  const allPages = getAllPages(state.catalog)
  return {allPages, entries: state.catalog.entries, settings}
}

export default connect(mapStateToProps)(HomePage)
