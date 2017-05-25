import path from 'path'
import fs from 'fs-extra'


const cache = {}

// TODO: Find a better solution than this ugly thing (initWithPath) we have here.
// Probably best import all schemata to the state and initialize it
// similar to the catalog.
export function initWithPath(formsPath) {
  cache.formsPath = formsPath
}

export function getSchema(form) {
  if (!cache.formsPath) {
    return {}
  }
  if (!cache.definitions) {
  const defsPath = [cache.formsPath, 'definitions.json'].join(path.sep)
    cache.definitions = fs.readJsonSync(defsPath)
  }
  const definitions = cache.definitions
  if (!cache[form]) {
    const formPath = [cache.formsPath, form].join(path.sep) + '.json';
    const schema = fs.readJsonSync(formPath)
    schema.properties = _.pick(schema.properties, Object.keys(definitions))
    schema.definitions = definitions
    cache[form] = schema
  }
  return cache[form]
}

export function getFormNames() {
  if (!cache.formsPath) {
    return ['']
  }
  if (!cache.formNames) {
    const formFileNames = fs.readdirSync(cache.formsPath)
    const formNames = formFileNames.
      map(formFileName => {
        return path.basename(formFileName, '.json')
      }).
      filter(formName => {
        return !['.DS_Store', 'definitions'].includes(formName)
      })
    cache.formNames = formNames
  }
  return cache.formNames
}
