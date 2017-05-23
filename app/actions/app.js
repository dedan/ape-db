export const SELECT_BOOK = 'SELECT_BOOK'

export function selectBook(bookId) {
  return {type: SELECT_BOOK, bookId}
}
