export default {
  required: ({field, value}, label) => `${label || field} is required`,
  email: ({field, value}, label) => `${label || 'Email address'} is invalid.`,
  confirmed: ({field, value}, label) => `${label || field} does not match the confirmation field.`,
  default: ({field, value}) => `The ${field} field is invalid.`
}
