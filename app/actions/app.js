export const SELECT_BOOK = 'SELECT_BOOK'

export const SET_WITH_ENTRY_FILTER = 'SET_WITH_ENTRY_FILTER'
export const SET_ENTRY_VALIDITY_FILTER = 'SET_ENTRY_VALIDITY_FILTER'
export const SET_ENTRY_TYPE_FILTER = 'SET_ENTRY_TYPE_FILTER'
export const SET_PLACEHOLDER_ENTRY_FILTER = 'SET_PLACEHOLDER_ENTRY_FILTER'



export function selectBook(bookId) {
  return {type: SELECT_BOOK, bookId}
}

export function setWithEntryFilter(value) {
  if (!['with', 'without', 'off'].includes(value)) {
    throw 'Invalid filter value'
  }
  return {type: SET_WITH_ENTRY_FILTER, value}
}
