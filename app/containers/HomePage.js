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


class HomePage extends Component {

  handleFileCopied = (bookId, newPage) => {
    const {actions, settings} = this.props
    actions.addPage(bookId, newPage)
  }

  render() {
    const {actions, app, bookPages, books, entries, selectedBookId, settings} = this.props
    const headerStyle = {
      position: 'absolute',
      top: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 200,
      padding: 20,
    }
    const mainStyle = {
      top: 200,
      bottom: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      display: 'flex',
    }
    return (
      <div>
        <SettingsDialog
            isOpen={!settings.path} settings={settings}
            onSaveSettings={actions.setSettings} />
        <BusyDialog
            isOpen={app.isValidating} />
        <div style={headerStyle}>
          <div>
            <h2>{Object.keys(books).length} Books</h2>
          </div>
          <BookIndexFilter
              selectedBookId={selectedBookId}
              onWithEntryFilterClick={actions.setWithEntryFilter}
              onEntryValidityFilterClick={actions.setEntryValidityFilter} />
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

const BookIndexFilter = ({onWithEntryFilterClick, onEntryValidityFilterClick, selectedBookId}) => (
  <div style={{display: 'flex', width: 400}}>
    <FilterRadioGroup
        disabled={!selectedBookId}
        onChange={onWithEntryFilterClick}
        values={['off', 'with', 'without']}
        labels={['Off', 'With entries', 'No entries']} />
    <FilterRadioGroup
        disabled={!selectedBookId}
        onChange={onEntryValidityFilterClick}
        values={['off', 'valid', 'invalid', 'placeholder']}
        labels={['Off', 'With valid entries', 'With invalid entries', 'With placeholder']} />
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
  const {selectedBookId, withEntryFilterValue, entryValidityFilterValue} = state.app
  const {books, entries} = state.catalog

  const bookPages = _.values(books[selectedBookId]).filter(page => {

    let withEntryFilter
    if (withEntryFilterValue === 'with') {
      withEntryFilter = page.entries.length
    } else if (withEntryFilterValue === 'without') {
      withEntryFilter = !page.entries.length
    } else if (withEntryFilterValue === 'off') {
      withEntryFilter = true
    } else {
      throw 'Invalid value'
    }

    let entryValidityFilter
    if (entryValidityFilterValue === 'valid') {
      entryValidityFilter = page.entries.some(entryId => {
        const entry = entries[entryId]
        return entry.isValidated && entry.isValid
      })
    } else if (entryValidityFilterValue === 'invalid') {
      entryValidityFilter = page.entries.some(entryId => {
        const entry = entries[entryId]
        return entry.isValidated && !entry.isValid
      })
    } else if (entryValidityFilterValue === 'placeholder') {
      entryValidityFilter = page.entries.some(entryId => {
        return entries[entryId].isPlaceholder
      })
    } else if (entryValidityFilterValue === 'off') {
      entryValidityFilter = true
    } else {
      throw 'Invalid value'
    }

    return withEntryFilter && entryValidityFilter
  })
  return {app, books, bookPages, entries, selectedBookId, settings}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...appActions, ...mixedActions}, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
