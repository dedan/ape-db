import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import path from 'path'
import Catalog from '../components/Catalog';
import FileAdder from '../components/FileAdder';
import {addFile} from '../actions/actions'
import {getSchema} from '../store/schema'
import {List, ListItem} from 'material-ui/List';
import * as appActions from '../actions/app'
import _ from 'underscore'

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
    const {actions, bookPages, books, entries, settings} = this.props
    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 100,
      padding: 20,
    }
    return (
      <div>
        <div style={headerStyle}>
          <div>
            <h2>{Object.keys(books).length} Books</h2>
          </div>
          <BookIndexFilter />
          <BookIndexValidation />
        </div>
        <div style={{display: 'flex'}}>
          <BookList books={books} onItemClick={actions.selectBook} />
          <Catalog allPages={bookPages} entries={entries} />
        </div>
        <FileAdder
            basePath={settings.path}
            onFileCopied={this.handleFileCopied} />
      </div>
    );
  }
}

class BookIndexFilter extends Component {

  render() {
    return (
      <div>Index Filter</div>
    )
  }
}

class BookIndexValidation extends Component {

  render() {
    return (
      <div>Index Validation</div>
    )
  }
}

const BookList = ({books, onItemClick}) => (
  <List>
    {Object.keys(books).map(bookId => {
      return <ListItem
        key={bookId}
        onClick={() => onItemClick(bookId)}
        primaryText={bookId} />
    })}
  </List>
)


function mapStateToProps(state) {
  const {settings} = state
  const {books, entries} = state.catalog
  const bookPages = _.values(books[state.app.selectedBookId])
  return {books, bookPages, entries, settings}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
