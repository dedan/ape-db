

export function filterBookPages(book, entries, pageFilter) {
  return _.values(book).filter(page => {
    switch (pageFilter) {
      case 'off':
        return true
      case 'with':
        return page.entries.length
      case 'without':
        return !page.entries.length
      case 'valid':
        return (page.entries || []).some(entryId => {
          const entry = entries[entryId]
          return entry.isValidated && entry.isValid
        })
      case 'invalid':
        return (page.entries || []).some(entryId => {
          const entry = entries[entryId]
          return entry.isValidated && !entry.isValid
        })
      case 'placeholder':
        return (page.entries || []).some(entryId => {
          return entries[entryId].isPlaceholder
        })
      default:
        console.log(`Invalid filter value ${pageFilter}`)
    }
  })
}
