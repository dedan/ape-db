const storage = require('electron-json-storage');
const klawSync = require('klaw-sync');
import path from 'path'
var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
import fs from 'fs-extra'
import {getSchema, initWithPath} from '../store/schema'


export const SET_SETTINGS = 'SET_SETTINGS'
export const INVALID_BOOK_ERROR = 'INVALID_BOOK_ERROR'
export const INVALID_PAGE_ERROR = 'INVALID_PAGE_ERROR'
export const INVALID_PATH_DEPTH = 'INVALID_PATH_DEPTH'
export const ADD_CATALOG = 'ADD_CATALOG'
export const ADD_PAGE = 'ADD_PAGE'
export const ADD_THUMBNAIL = 'ADD_THUMBNAIL'
export const ADD_ENTRY = 'ADD_ENTRY'
export const UPDATE_ENTRY = 'UPDATE_ENTRY'
export const START_ENTRIES_VALIDATION = 'START_ENTRIES_VALIDATION'
export const UPDATE_ALL_ENTRIES = 'UPDATE_ALL_ENTRIES'

const BOOK_REG = /^\w{2}\.\w+\.[MF]\.\d\.\d{4}$/
const PAGE_REG = /^p\d{3}\w?$/
const ORIGINAL_REG = /^\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}\w?.jpg$/
const THUMBNAIL_REG = /^\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}\w?_thumbnail.jpg$/


export function addNewBookName(newBookName) {
  return (dispatch, getState) => {
    const {settings} = getState()
    settings.bookNames = (settings.bookNames || []).concat([newBookName])
    dispatch(setSettings(settings))
  }
}

export function updateEntry(entryId, properties) {
  return {type: UPDATE_ENTRY, entryId, properties}
}

export function addPage(bookId, newPage) {
  return {type: ADD_PAGE, bookId, newPage}
}

export function setSettings(settings) {
  return (dispatch, getState) => {
    const oldPath = getState().settings.path
    storage.set('settings', settings, function(error) {
      if (error) throw error;
    });
    dispatch({type: SET_SETTINGS, settings})
  }
}

export function validateEntries() {
  return (dispatch, getState) => {
    dispatch({type: START_ENTRIES_VALIDATION})
    const entries = getState().catalog.entries
    Object.keys(entries).forEach(entryId => {
      const entry = entries[entryId]
      const schema = getSchema(entry.form)
      const entryData = fs.readJsonSync(entry.path)
      if (entryData.isPlaceholder) {
        return
      }
      try {
        var valid = ajv.validate(schema, entryData);
        entries[entryId] = {
          ...entry,
          isValidated: true,
          isValid: valid,
          errors: valid ? null : ajv.errors,
        }
      }
      catch (e) {
        console.log('>>', e)
      }
    })
    dispatch({type: UPDATE_ALL_ENTRIES, entries})
  }
}

export function addNewEntry(book, page, entry) {
  return {type: ADD_ENTRY, book, page, entry}
}

export function loadCatalog(basePath) {
  return dispatch => {
    let books = {}
    let entries = {}
    const filterFn = item => item.path.indexOf('.DS_Store') < 0
    const paths = klawSync(basePath, {filter: filterFn, nodir: true})
    paths.forEach(pathStats => {
      const file = splitAbsPath(basePath, pathStats.path)
      if (file.errors.length) {
        file.errors.forEach(dispatch)
        return
      }

      if (!books[file.book]) {
        books[file.book] = {}
      }
      const currentBook = books[file.book]
      if (!currentBook[file.page]) {
        currentBook[file.page] = {entries: [], pageId: file.page}
      }
      const currentPage = currentBook[file.page]

      const fileType = getFileType(file.fileName)
      switch (fileType) {
        case 'ORIGINAL':
          currentPage.original = pathStats.path
          return
        case 'THUMBNAIL':
          currentPage.thumbnail = pathStats.path
          return
        case 'ENTRY':
          const entryId = file.book + '_' + file.fileName.slice(0, -5)
          const [book, entryNumber, form] = entryId.split('_')
          currentPage.entries.push(entryId)
          const entry = fs.readJsonSync(pathStats.path)
          entries[entryId] = {
            isPlaceholder: entry.isPlaceholder,
            path: pathStats.path,
            entryNumber,
            form,
            entryId,
          }
      }
    })
    const catalog = {books, entries}
    dispatch({type: ADD_CATALOG, catalog})
  }
}

function splitAbsPath(basePath, filePath) {
  const relFilePath = filePath.slice(basePath.length + 1)
  const splitPath = relFilePath.split(path.sep)
  let errors = []
  if (splitPath.length !== 3) {
    // Only files within a page folder within a book folder.
    errors.push({type: INVALID_PATH_DEPTH, relFilePath})
  }
  const [book, page, fileName] = splitPath
  if (!BOOK_REG.test(book)) {
    errors.push({type: INVALID_BOOK_ERROR, book, relFilePath})
  }
  if (!PAGE_REG.test(page)) {
    errors.push({type: INVALID_PAGE_ERROR, page, relFilePath})
  }
  return {book, page, fileName, errors}
}


function getFileType(fileName) {
  if (ORIGINAL_REG.test(fileName)) {
    return 'ORIGINAL'
  }
  if (THUMBNAIL_REG.test(fileName)) {
    return 'THUMBNAIL'
  }
  if (fileName.endsWith('.json')) {
    return 'ENTRY'
  }
}
