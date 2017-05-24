import React, {Component} from 'react'
import {getSchema} from '../store/schema'
import Form from "react-jsonschema-form"


export class EntryForm extends Component {

  render() {
    const {currentEntry, currentEntryData} = this.props
    if (!currentEntry || !currentEntryData) {
      return <div>select an entry</div>
    }
    const schema = getSchema(currentEntry.form)
    const uiSchema = {}
    schema && _.each(schema.properties, (ref, key) => {
      const splitRef = ref['$ref'].split('/')
      const def = schema.definitions[splitRef.pop()]
      const shouldBeRadio = def.enum && def.enum.length < 4
      if (shouldBeRadio) {
        uiSchema[key] = {"ui:widget": "radio"}
      }
    })
    return <div>
      {currentEntry.entryId}
      <Form
          uiSchema={uiSchema}
          schema={schema}
          formData={currentEntryData}
          onSubmit={this.handleFormSubmit} />
    </div>
  }
}
