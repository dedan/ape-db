import fs from 'fs-extra'
var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const SCHEMA_PATH = '/Users/dedan/projects/monkey-db/test/test-forms/N-AR.json'
const DATA_PATH = '/Users/dedan/projects/monkey-db/test/test-folder/OU.Newton.M.1.2003/p004/E0001_N-AR.json'

const testSchema = {
  type: 'object',
  title: 'N-AR',
  definitions: {
    sex: {
      title: 'Jenis kelamin / Sex',
      "enum": ["F", "M", "\u00d8"],
      "enumNames": ["\u2640", "\u2642", "[blank]"],
      type: 'string'
    }
  },
  "properties": {
    "sex": {
      "$ref": "#/definitions/sex"
    }
  }
}

describe('Schema validation', () => {
  it('it should mark valid data as valid', () => {
    var valid = ajv.validate(testSchema, {sex: 'M'});
    expect(valid).toBe(true)
  });

  it('it should mark invalid data as not valid', () => {
    var valid = ajv.validate(testSchema, {sex: 'BLA'});
    expect(valid).toBe(false)
  });
});
