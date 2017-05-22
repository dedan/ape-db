import path from 'path'
import fs from 'fs-extra'

const FORMS_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/'
const DEFS_PATH = [FORMS_PATH, 'definitions.json'].join(path.sep)
const definitions = fs.readJsonSync(DEFS_PATH)

const cache = {}

export function getSchema(form) {
  if (!cache[form]) {
    const formPath = [FORMS_PATH, form].join(path.sep) + '.json';
    const schema = fs.readJsonSync(formPath)
    schema.properties = _.pick(schema.properties, Object.keys(definitions))
    schema.definitions = definitions
    cache[form] = schema
  }
  return cache[form]
}
