import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import path from 'path'
import Catalog from '../components/Catalog';
import FileAdder from '../components/FileAdder';
import {addFile, validateEntries} from '../actions/actions'
import {getSchema} from '../store/schema'
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import * as appActions from '../actions/app'
import _ from 'underscore'
import PropTypes from 'prop-types';
import {grey300} from 'material-ui/styles/colors';

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
    const {actions, bookPages, books, entries, selectedBookId, settings} = this.props
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
          <BookIndexValidation onValidateClick={actions.validateEntries} />
        </div>
        <div style={{display: 'flex'}}>
          <div style={{paddingRight: 20}}>
            <BookList
                books={books}
                onItemClick={actions.selectBook}
                selectedBookId={selectedBookId} />
          </div>
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

const BookIndexValidation = ({onValidateClick}) => (
  <div>
    <RaisedButton
        label="validate entries"
        style={{margin: 12}}
        onClick={onValidateClick} />
  </div>
)


const BookList = ({books, onItemClick, selectedBookId}) => (
  <List>
    {_.map(books, (book, bookId) => {
      const backgroundColor = selectedBookId === bookId ? grey300 : null
      return <ListItem
        key={bookId}
        style={{backgroundColor}}
        onClick={() => onItemClick(bookId)}
        primaryText={bookId}
        secondaryText={`${Object.keys(book).length} pages`} />
    })}
  </List>
)


function mapStateToProps(state) {
  const {settings} = state
  const {selectedBookId} = state.app
  const {books, entries} = state.catalog
  const bookPages = _.values(books[selectedBookId])
  return {books, bookPages, entries, selectedBookId, settings}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...appActions, validateEntries}, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
