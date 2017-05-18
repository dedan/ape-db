// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import path from 'path'

class DetailsPage extends Component {

  render() {
    const {basePath, currentPage} = this.props
    console.log('>>', currentPage)
    const imagePath = [basePath, currentPage]
    return (
      <div>
        <h1>The details</h1>
        <Link to="/">
          <i className="fa fa-arrow-left fa-3x" />
        </Link>

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {book, page} = ownProps.match.params
  return {
    currentPage: state.catalog[book][page],
    basePath: state.settings.path,
  }
}

export default connect(mapStateToProps)(DetailsPage)
