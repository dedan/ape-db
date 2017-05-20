// TODO: bring back the flow.
import update from 'immutability-helper';
import {ADD_CATALOG, ADD_ORIGINAL, ADD_THUMBNAIL, ADD_ENTRY} from '../actions/actions';

const initialState = {
  'OU.ADUL.F.1.1998': {
    'p051': {
      original: 'OU.ADUL.F.1.1998_p051.jpg',
      thumbnail: 'OU.ADUL.F.1.1998_p051_thumbnail.jpg',
      entries: [
        'bla_2932323.json',
        'blbu_296611.json',
      ]
    }
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

function upsertEntry(catalog, action, props) {
  const currentBook = catalog[action.book] || {}
  const currentPage = currentBook[action.page] || {}
  const currentEntry = currentBook[action.entry] || {}
  return {
    ...catalog,
    [action.book]: {
      ...currentBook,
      [action.page]: {
        ...currentPage,
        entries: {
          [action.entry]: {
            ...currentEntry,
            ...props,
          }
        }
      }
    }
  }
}

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case ADD_CATALOG:
      return action.catalog
    case ADD_ORIGINAL:
      return upsertPage(state, action, {original: action.absPath})
    case ADD_ENTRY:
      return upsertEntry(state, action, {path: action.absPath})
    default:
      return state;
  }
}
