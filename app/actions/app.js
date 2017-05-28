export const SELECT_BOOK = 'SELECT_BOOK'
export const SET_PAGE_FILTER = 'SET_PAGE_FILTER'

export const PAGE_FILTER_VALUES = {
  off: 'with any kind of',
  with: 'with',
  without: 'without',
  valid: 'with valid',
  invalid: 'with invalid',
  placeholder: 'with placeholder',
}

export function selectBook(bookId) {
  return {type: SELECT_BOOK, bookId}
}

export function setPageFilter(value) {
  if (!PAGE_FILTER_VALUES[value]) {
    throw `Invalid filter value (${value})`
  }
  return {type: SET_PAGE_FILTER, value}
}
