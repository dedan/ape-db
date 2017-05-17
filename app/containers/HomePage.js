// @flow
import React, { Component } from 'react';
import {connect} from 'react-redux'
import path from 'path'
import Catalog from '../components/Catalog';

class HomePage extends Component {
  render() {
    const {allPages} = this.props
    return (
      <div>
        <Header />
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
  return {allPages}
}

export default connect(mapStateToProps)(HomePage)
