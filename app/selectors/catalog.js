
export function getAllPages(catalog) {
  const allPages = []
  Object.keys(catalog.books).forEach(book => {
    Object.keys(catalog.books[book]).forEach(page => {
      const pageObject = {
        ...catalog.books[book][page],
        book,
        page,
      }
      allPages.push(pageObject)
    })
  })
  return allPages
}
