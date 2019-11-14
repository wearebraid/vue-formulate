import { sentence as s } from '../libs/utils'
/**
 * Validation error message generators.
 */
export default {

  /**
   * Valid accepted value.
   */
  accepted: function ({ name }) {
    return `Please accept the ${name}.`
  },

  /**
   * The date is not after.
   */
  after: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} must be after ${args[0]}.`
    }
    return `${s(name)} must be a later date.`
  },

  /**
   * The value is not a letter.
   */
  alpha: function ({ name }) {
    return `${s(name)} can only contain alphabetical characters.`
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function ({ name }) {
    return `${s(name)} can only contain letters and numbers.`
  },

  /**
   * The date is not before.
   */
  before: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} must be before ${args[0]}.`
    }
    return `${s(name)} must be an earlier date.`
  },

  /**
   * The value is not between two numbers or lengths
   */
  between: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${s(name)} must be between ${args[0]} and ${args[1]}.`
    }
    return `${s(name)} must be between ${args[0]} and ${args[1]} characters long.`
  },

  /**
   * Is not a valid date.
   */
  date: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} is not a valid, please use the format ${args[0]}`
    }
    return `${s(name)} is not a valid date.`
  },

  /**
   * The default render method for error messages.
   */
  default: function ({ name }) {
    return `This field isn’t valid.`
  },

  /**
   * Is not a valid email address.
   */
  email: function ({ name, value }) {
    if (!value) {
      return 'Please enter a valid email address.'
    }
    return `“${value}” is not a valid email address.`
  },

  /**
   * Value is an allowed value.
   */
  in: function ({ name, value }) {
    if (typeof value === 'string' && value) {
      return `“${s(value)}” is not an allowed ${name}.`
    }
    return `This is not an allowed ${name}.`
  },

  /**
   * Value is not a match.
   */
  matches: function ({ name }) {
    return `${s(name)} is not an allowed value.`
  },

  /**
   * The maximum value allowed.
   */
  max: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${name} must be less than ${args[0]}.`
    }
    return `${name} must be less than ${args[0]} characters long.`
  },

  /**
   * The maximum value allowed.
   */
  min: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${name} must be more than ${args[0]}.`
    }
    return `${name} must be more than ${args[0]} characters long.`
  },

  /**
   * The field is not an allowed value
   */
  not: function ({ name, value }) {
    return `“${value}” is not an allowed ${name}.`
  },

  /**
   * The field is not a number
   */
  number: function ({ name }) {
    return `${s(name)} must be a number.`
  },

  /**
   * Required field.
   */
  required: function ({ name }) {
    return `${s(name)} is required.`
  },

  /**
   * Value is not a url.
   */
  url: function ({ name }) {
    return `Please include a valid url.`
  }
}
