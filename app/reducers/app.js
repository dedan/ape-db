import {SELECT_BOOK, SET_WITH_ENTRY_FILTER, SET_ENTRY_VALIDITY_FILTER} from '../actions/app'

const initialState = {
  withEntryFilterValue: 'off',
  entryValidityFilterValue: 'off',
}

export default function app (state=initialState, action) {
  switch(action.type) {
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
