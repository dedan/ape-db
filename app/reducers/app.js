import {SELECT_BOOK, SET_PAGE_FILTER} from '../actions/app'
import {START_ENTRIES_VALIDATION, UPDATE_ALL_ENTRIES} from '../actions/actions'

const initialState = {
  pageFilter: 'off',
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
    case SET_PAGE_FILTER:
      return {
        ...state,
        pageFilter: action.value
      }
    default:
      return state
  }
}
