import {SELECT_BOOK, SET_WITH_ENTRY_FILTER} from '../actions/app'

const initialState = {
  withEntryFilterValue: 'off',
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
    default:
      return state
  }
}
