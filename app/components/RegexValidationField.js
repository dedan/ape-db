import React, {Component} from 'react'
import TextField from 'material-ui/TextField'

export default class RegexValidationField extends Component {

  handleChange = e => {
    const {regex, onChange} = this.props
    const value = e.target.value
    const isValid = regex.test(value)
    onChange(e, !isValid)
  }

  render() {
    const {label, onChange, regex, errorMessage, value} = this.props
    const isInValid = value && !regex.test(value)
    return <TextField
        value={value}
        floatingLabelText={label}
        onChange={this.handleChange}
        errorText={isInValid ? errorMessage : null} />
  }
}
