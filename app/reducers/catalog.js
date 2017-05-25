// TODO: bring back the flow.
import update from 'immutability-helper';
import {ADD_CATALOG, ADD_ORIGINAL, ADD_THUMBNAIL, ADD_ENTRY,
UPDATE_ALL_ENTRIES} from '../actions/actions';

const initialState = {
  books: {},
  entries: {},
}

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case ADD_ORIGINAL:
      return upsertPage(state, action, {original: action.filePath})
    case ADD_THUMBNAIL:
      return upsertPage(state, action, {thumbnail: action.filePath})
    case ADD_CATALOG:
      return action.catalog
    case UPDATE_ALL_ENTRIES:
      return {
        books: state.books,
        entries: action.entries
      }
    case ADD_ENTRY:
      return {
        books: {
          ...state.books,
          [action.book]: {
            ...state.books[action.book],
            [action.page]: {
              ...state.books[action.book][action.page],
              entries: [
                ...state.books[action.book][action.page].entries,
                action.entry.entryId,
              ]
            }
          }
        },
        entries: {
          ...state.entries,
          [action.entry.entryId]: action.entry
        }
      }
    default:
      return state;
  }
}

function upsertPage(catalog, action, props) {
  const currentBook = catalog[action.book] || {}
  const currentPage = currentBook[action.page] || {}
  return {
    ...catalog,
    [action.book]: {
      ...currentBook,
      [action.page]: {
        ...currentPage,
        ...props
      }
    }
  }
}
