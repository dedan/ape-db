import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import path from 'path'
import Catalog from '../components/Catalog';
import FileAdder from '../components/FileAdder';
import * as mixedActions from '../actions/actions'
import {getSchema} from '../store/schema'
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import * as appActions from '../actions/app'
import _ from 'underscore'
import PropTypes from 'prop-types';
import {grey300} from 'material-ui/styles/colors';
import BusyDialog from '../components/BusyDialog'
import SettingsDialog from '../components/SettingsDialog'
import storage from 'electron-json-storage';
import {initWithPath} from '../store/schema'
import fs from 'fs-extra'
import {PAGE_FILTER_VALUES} from '../actions/app'
import {filterBookPages} from '../selectors/catalog'


class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isCatalogPathInvalid: false,
      isFormsPathInvalid: false,
      isSettingsLoaded: false,
    }

    if (Object.keys(props.books).length) {
      return
    }
    storage.get('settings', (error, settings) => {
      if (error) throw error;
      const isCatalogPathInvalid = !fs.existsSync(settings.path)
      const isFormsPathInvalid = !fs.existsSync(settings.formsPath)
      if (isCatalogPathInvalid || isFormsPathInvalid) {
        this.setState({
          isCatalogPathInvalid,
          isFormsPathInvalid,
          stateSettings: settings,
        })
        return
      }
      this.setSettingsAndLoadCatalog(settings)
    })
  }

  setSettingsAndLoadCatalog = settings => {
    const {actions} = this.props
    actions.setSettings(settings)
    initWithPath(settings.formsPath)
    actions.loadCatalog(settings.path)
    this.setState({
      isSettingsLoaded: true,
      isCatalogPathInvalid: false,
      isFormsPathInvalid: false,
    })
  }

  handleFileCopied = (bookId, newPage) => {
    const {actions, settings} = this.props
    actions.addPage(bookId, newPage)
  }

  render() {
    const {actions, app, bookPages, books, entries, selectedBookId, settings} = this.props
    const {isCatalogPathInvalid, isFormsPathInvalid, stateSettings, isSettingsLoaded} = this.state
    const invalidPath = isCatalogPathInvalid || isFormsPathInvalid
    const isSettingsDialogOpen = isSettingsLoaded && !settings.path || invalidPath
    const headerStyle = {
      position: 'absolute',
      top: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 300,
      padding: 20,
    }
    const mainStyle = {
      top: 300,
      bottom: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      display: 'flex',
    }
    return (
      <div>
        <SettingsDialog
            isOpen={isSettingsDialogOpen}
            settings={invalidPath ?  stateSettings : settings}
            isCatalogPathInvalid={isCatalogPathInvalid}
            isFormsPathInvalid={isFormsPathInvalid}
            onSaveSettings={this.setSettingsAndLoadCatalog} />
        <BusyDialog
            isOpen={app.isValidating} />
        <div style={headerStyle}>
          <div>
            <h2>{Object.keys(books).length} Books</h2>
          </div>
          <BookIndexFilter
              selectedBookId={selectedBookId}
              onPageFilterClick={actions.setPageFilter} />
          <BookIndexValidation onValidateClick={actions.validateEntries} />
        </div>
        <div style={mainStyle}>
          <div style={{paddingRight: 20, overflowY: 'scroll'}}>
            <BookList
                books={books}
                onItemClick={actions.selectBook}
                selectedBookId={selectedBookId} />
          </div>
          <div style={{overflowY: 'scroll', flex: 1}}>
            <Catalog bookId={selectedBookId} bookPages={bookPages} entries={entries} />
          </div>
        </div>
        <FileAdder
            settings={settings}
            onNewBookCreated={newBookName => actions.addNewBookName(newBookName)}
            onFileCopied={this.handleFileCopied} />
      </div>
    );
  }
}

const BookIndexFilter = ({onPageFilterClick, selectedBookId}) => (
  <div style={{display: 'flex', width: 400}}>
    <FilterRadioGroup
        disabled={!selectedBookId}
        onChange={onPageFilterClick}
        values={Object.keys(PAGE_FILTER_VALUES)}
        labels={Object.keys(PAGE_FILTER_VALUES)} />
  </div>
)

const FilterRadioGroup = ({values, labels, onChange, disabled}) => (
  <RadioButtonGroup style={{flex: 1}}
      name={values[0]}
      onChange={(e, value) => onChange(value)}
      defaultSelected={values[0]}>
    {values.map((value, i) => {
      return <RadioButton
          disabled={disabled}
          key={value}
          value={value} label={labels[i]}
          style={{marginBottom: 12}} />
    })}
  </RadioButtonGroup>
)


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
  const {app, settings} = state
  const {selectedBookId, pageFilter} = state.app
  const {books, entries} = state.catalog
  const bookPages = filterBookPages(books[selectedBookId], entries, pageFilter)
  return {app, books, bookPages, entries, selectedBookId, settings}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...appActions, ...mixedActions}, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
