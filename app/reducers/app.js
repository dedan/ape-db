import {
  SELECT_BOOK,
  SET_WITH_ENTRY_FILTER,
  SET_ENTRY_VALIDITY_FILTER,
} from '../actions/app'
import {
  START_ENTRIES_VALIDATION,
  UPDATE_ALL_ENTRIES,
} from '../actions/actions'

const initialState = {
  withEntryFilterValue: 'off',
  entryValidityFilterValue: 'off',
  isValidating: false,
}

export default function app (state=initialState, action) {
  switch(action.type) {
    case START_ENTRIES_VALIDATION:
      return {
        ...state,
        isValidating: true,
      }
    case UPDATE_ALL_ENTRIES:
      return {
        ...state,
        isValidating: false,
      }
    case SELECT_BOOK:
      return {
        ...state,
        selectedBookId: action.bookId,
      }
    case SET_WITH_ENTRY_FILTER:
      return {
        ...state,
        withEntryFilterValue: action.value
      }
    case SET_ENTRY_VALIDITY_FILTER:
      return {
        ...state,
        entryValidityFilterValue: action.value
      }
    default:
      return state
  }
}
