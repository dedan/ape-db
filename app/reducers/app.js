import {SELECT_BOOK} from '../actions/app'

const initialState = {

}

export default function app (state = initialState, action) {
  switch(action.type) {
    case SELECT_BOOK:
      return {
        ...state,
        selectedBookId: action.bookId,
      }
    default:
      return state
  }
}
