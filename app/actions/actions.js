const storage = require('electron-json-storage');
const klawSync = require('klaw-sync');
import path from 'path'
var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
import fs from 'fs-extra'
import {getAllPages} from '../selectors/catalog'
import {getSchema} from '../store/schema'

export const SET_SETTINGS = 'SET_SETTINGS'
export const INVALID_BOOK_ERROR = 'INVALID_BOOK_ERROR'
export const INVALID_PAGE_ERROR = 'INVALID_PAGE_ERROR'
export const INVALID_PATH_DEPTH = 'INVALID_PATH_DEPTH'
export const ADD_CATALOG = 'ADD_CATALOG'
export const ADD_ORIGINAL = 'ADD_ORIGINAL'
export const ADD_THUMBNAIL = 'ADD_THUMBNAIL'
export const ADD_ENTRY = 'ADD_ENTRY'
export const START_ENTRIES_VALIDATION = 'START_ENTRIES_VALIDATION'
export const UPDATE_ALL_ENTRIES = 'UPDATE_ALL_ENTRIES'

const BOOK_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}/
const PAGE_REG = /p\d{3}/
const ORIGINAL_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}.jpg/
const THUMBNAIL_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}_thumbnail.jpg/


export function setSettings(settings) {
  storage.set('settings', settings, function(error) {
    if (error) throw error;
  });

  return {
    type: SET_SETTINGS,
    settings
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
        currentBook[file.page] = {entries: []}
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
          const entryId = file.fileName.slice(0, -5)
          const [entryNumber, form] = entryId.split('_')
          currentPage.entries.push(entryId)
          entries[entryId] = {
            path: pathStats.path,
            entryNumber,
            form,
            entryId,
          }
      }
    })
    const catalog = {books, entries}
    console.log('>>', catalog)
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
