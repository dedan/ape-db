const storage = require('electron-json-storage');
import path from 'path'

export const SET_SETTINGS = 'SET_SETTINGS'
export const INVALID_BOOK_ERROR = 'INVALID_BOOK_ERROR'
export const INVALID_PAGE_ERROR = 'INVALID_PAGE_ERROR'
export const ADD_ORIGINAL = 'ADD_ORIGINAL'
export const ADD_THUMBNAIL = 'ADD_THUMBNAIL'
export const ADD_ENTRY = 'ADD_ENTRY'

export function setSettings(settings) {
  storage.set('settings', settings, function(error) {
    if (error) throw error;
  });

  return {
    type: SET_SETTINGS,
    settings
  }
}


const BOOK_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}/
const PAGE_REG = /p\d{3}/
const ORIGINAL_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}.jpg/
const THUMBNAIL_REG = /\w{2}\.\w+\.[MF]\.\d\.\d{4}_p\d{3}_thumbnail.jpg/

export function addFile(relFilePath, fstat) {
  return (dispatch: () => void) => {

    const splitPath = relFilePath.split(path.sep)
    // Only files within a page folder within a book folder.
    if (fstat.isDirectory() || splitPath.length !== 3) {
      return
    }

    const [book, page, fileName] = splitPath
    if (!BOOK_REG.test(book)) {
      dispatch({type: INVALID_BOOK_ERROR, book, relFilePath})
    }
    if (!PAGE_REG.test(page)) {
      dispatch({type: INVALID_PAGE_ERROR, page, relFilePath})
    }

    let actionType
    if (ORIGINAL_REG.test(fileName)) {
      actionType = ADD_ORIGINAL
    } else if (THUMBNAIL_REG.test(fileName)) {
      actionType = ADD_THUMBNAIL
    } else if (fileName.endsWith('.json')) {
      actionType = ADD_ENTRY
    } else {
      return
    }
    const action = {
      type: actionType,
      book,
      page,
      fileName,
      relFilePath,
    }
    dispatch(action)
  }
}
