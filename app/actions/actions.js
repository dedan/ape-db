const storage = require('electron-json-storage');
const klawSync = require('klaw-sync');
import path from 'path'

export const SET_SETTINGS = 'SET_SETTINGS'
export const INVALID_BOOK_ERROR = 'INVALID_BOOK_ERROR'
export const INVALID_PAGE_ERROR = 'INVALID_PAGE_ERROR'
export const INVALID_PATH_DEPTH = 'INVALID_PATH_DEPTH'
export const ADD_CATALOG = 'ADD_CATALOG'
export const ADD_ORIGINAL = 'ADD_ORIGINAL'
export const ADD_THUMBNAIL = 'ADD_THUMBNAIL'
export const ADD_ENTRY = 'ADD_ENTRY'

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

export function loadCatalog(basePath) {
  return dispatch => {
    let catalog = {}
    const filterFn = item => item.path.indexOf('.DS_Store') < 0
    const paths = klawSync(basePath, {filter: filterFn, nodir: true})
    paths.forEach(pathStats => {
      const file = splitAbsPath(basePath, pathStats.path)
      if (file.errors.length) {
        file.errors.forEach(dispatch)
        return
      }

      if (!catalog[file.book]) {
        catalog[file.book] = {}
      }
      const currentBook = catalog[file.book]
      if (!currentBook[file.page]) {
        currentBook[file.page] = {entries: {}}
      }
      const currentPage = catalog[file.book][file.page]

      const fileType = getFileType(file.fileName)
      switch (fileType) {
        case 'ORIGINAL':
          currentPage.original = pathStats.path
          return
        case 'ENTRY':
          const entry = file.fileName.slice(0, -5)
          const [entryNumber, form] = entry.split('_')
          if (!currentPage.entries[entry]) {
            currentPage.entries[entry] = {}
          }
          currentPage.entries[entry] = {
            path: pathStats.path,
            entryNumber,
            form,
          }
      }
    })
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
