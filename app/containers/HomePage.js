// @flow
import React, { Component } from 'react';
import {connect} from 'react-redux'
import path from 'path'
import Catalog from '../components/Catalog';
import FileAdder from '../components/FileAdder';
import {addFile} from '../actions/actions'

class HomePage extends Component {

  handleFileCopied = relFilePath => {
    const {dispatch} = this.props
    const fakeFstat = {
      isDirectory: () => false
    }
    dispatch(addFile(relFilePath, fakeFstat))
  }

  render() {
    const {allPages, settings} = this.props
    return (
      <div>
        <Header />
        <FileAdder
            basePath={settings.path}
            onFileCopied={this.handleFileCopied} />
        <Catalog allPages={allPages} />
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return <div>Head</div>
  }
}

function mapStateToProps(state) {
  const allPages = []
  const {settings} = state
  Object.keys(state.catalog).forEach(book => {
    Object.keys(state.catalog[book]).forEach(page => {
      const pageObject = {
        ...state.catalog[book][page],
        pagePath: [settings.path, book, page].join(path.sep)
      }
      allPages.push(pageObject)
    })
  })
  return {allPages, settings}
}

export default connect(mapStateToProps)(HomePage)
