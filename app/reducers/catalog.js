// TODO: bring back the flow.
import update from 'immutability-helper';
import {ADD_CATALOG, ADD_ORIGINAL, ADD_THUMBNAIL, ADD_ENTRY,
UPDATE_ALL_ENTRIES} from '../actions/actions';

const initialState = {}

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case ADD_CATALOG:
      return action.catalog
    case UPDATE_ALL_ENTRIES:
      return {
        books: state.books,
        entries: action.entries
      }
    default:
      return state;
  }
}
