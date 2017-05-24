import React, {Component} from 'react'
import {getSchema} from '../store/schema'
import Form from "react-jsonschema-form"
import _ from 'underscore'
var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});


export class EntryForm extends Component {

  render() {
    const {currentEntry, currentEntryData, onSubmit} = this.props
    if (!currentEntry || !currentEntryData) {
      return <div>select an entry</div>
    }
    const schema = getSchema(currentEntry.form)
    return <MyForm
        schema={schema}
        formData={currentEntryData}
        onSubmit={onSubmit} />
  }
}


function getFieldForDef(def, value, changeHandler) {
  const isMissing = _.values(MISSING_VALUES).includes(value)
  const props = {
    disabled: _.values(MISSING_VALUES).includes(value),
    onChange: e => changeHandler(e.target.value),
    value
  }
  if (def.type === 'string' && !def.format && !def.enum && !def.optionalEnum) {
    return <input {...props} type="text" />
  } else if(def.enum) {
    return <div>
      <select {...props}>
        <option />
        {_.map(def.enum, (val, i) => {
          return <option key={val} value={val}>{def.enumNames[i]}</option>
        })}
      </select>
    </div>
  } else if (def.optionalEnum) {
    return <div>
      {_.map(def.optionalEnum, (val, i) => {
        return <div>
          <input
              {...props}
              type="radio" name={def.title}
              value={val}
              checked={val === value} />
          {def.optionalEnumNames[i]}
        </div>
      })}
      <div>
        Other: <input {...props} type="text" />
      </div>
    </div>
  } else if(def.format === 'date') {
    return <input {...props} type="date" />
  } else if(def.type === 'number') {
    return <input {...props}
        onChange={e => changeHandler(Number(e.target.value))}
        type="number" />
  } else {
    return <div style={{backgroundColor: 'red'}}>{def.type} - {def.format}</div>
  }
}

const MISSING_VALUES = {
  'string': 'Ø',
  'number': -999,
  'stringdate': '00-00-0000',
  'stringtime': '00:00',
}

class MyForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      localFormData: {...props.formData},
    }
  }

  handleFormSubmit = e => {
    e.preventDefault()
    const {onSubmit, schema} = this.props
    const {localFormData} = this.state
    const valid = ajv.validate(schema, localFormData)
    const errors = ajv.errors
    if (!valid) {
      const errors = _.indexBy(ajv.errors, 'dataPath')
      this.setState({errors})
    } else {
      this.setState({errors: null})
      onSubmit && onSubmit({formData: localFormData})
    }
  }

  handleLocalFormDataUpdate = (variable, value) => {
    const {localFormData} = this.state
    localFormData[variable] = value
    this.setState({localFormData})
  }

  handleMissingClick = (variable, type) => {
    const {localFormData} = this.state
    const value = localFormData[variable]
    if (_.values(MISSING_VALUES).includes(value)) {
      localFormData[variable] = ''
    } else {
      localFormData[variable] = MISSING_VALUES[type]
    }
    this.setState({localFormData})
  }

  render() {
    const {schema} = this.props
    const {errors, localFormData} = this.state
    return <form style={{paddingLeft: 50, width: 800}}>
      <h2>{schema.title}</h2>
      {errors ? 'you have errors in your form' : null}
      {_.map(schema.properties, (ref, key) => {
        const splitRef = ref['$ref'].split('/')
        const variable = splitRef.pop()
        const def = schema.definitions[variable]
        const variableType = def.type + (def.format || '')
        return <FieldTemplate
            onMissingClick={() => this.handleMissingClick(variable, variableType)}
            key={variable} label={def.title}
            value={localFormData[variable]}
            error={errors && errors['.' + variable]}>
          {getFieldForDef(
            def, localFormData[variable],
            newValue => this.handleLocalFormDataUpdate(variable, newValue)
          )}
        </FieldTemplate>
      })}
      {errors ? 'you have errors in your form' : null}
      <button onClick={this.handleFormSubmit}>submit</button>
    </form>
  }
}

const FieldTemplate = ({label, children, variable, value, error, onMissingClick}) => (
  <div style={{marginBottom: 15, border: '1px dashed gray', padding: 4}}>
    <div>
      <input
          onChange={onMissingClick}
          type="checkbox"
          checked={_.values(MISSING_VALUES).includes(value)} />
      <label htmlFor={'check' + variable}>missing or n/a?</label>
    </div>
    <label>{label}</label>
    {children}
    <div style={{backgroundColor: 'red'}}>
      {error ? `${error.message} (${JSON.stringify(error.params)}` : null}
    </div>
  </div>
)
