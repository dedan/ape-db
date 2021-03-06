// TODO: bring back the flow.
import update from 'immutability-helper';
import {ADD_CATALOG, ADD_PAGE, ADD_THUMBNAIL, ADD_ENTRY,
UPDATE_ALL_ENTRIES, UPDATE_ENTRY} from '../actions/actions';

const initialState = {
  books: {},
  entries: {},
}

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case ADD_PAGE:
      return upsertPage(state, action.bookId, action.newPage.pageId, action.newPage)
    case ADD_CATALOG:
      return action.catalog
    case UPDATE_ENTRY:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.entryId]: {
            ...state.entries[action.entryId],
            ...action.properties
          }
        }
      }
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

function upsertPage(catalog, bookId, pageId, props) {
  const currentBook = catalog[bookId] || {}
  const currentPage = currentBook[pageId] || {}
  return {
    ...catalog,
    books: {
      ...catalog.books,
      [bookId]: {
        ...currentBook,
        [pageId]: {
          ...currentPage,
          ...props
        }
      }
    }
  }
}
