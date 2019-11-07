import isUrl from 'is-url'
import { shallowEqualObjects } from './utils'

/**
 * Library of rules
 */
export default {
  /**
   * Rule: the value must be "yes", "on", "1", or true
   */
  accepted: function (value) {
    return Promise.resolve(['yes', 'on', '1', 1, true, 'true'].includes(value))
  },

  /**
   * Rule: must be a value
   */
  required: function (value, isRequired = true) {
    return Promise.resolve((() => {
      if (!isRequired || ['no', 'false'].includes(isRequired)) {
        return true
      }
      if (Array.isArray(value)) {
        return !!value.length
      }
      if (typeof value === 'string') {
        return !!value
      }
      if (typeof value === 'object') {
        return (!value) ? false : !!Object.keys(value).length
      }
      return true
    })())
  },

  /**
   * Rule: Value is in an array (stack).
   */
  in: function (value, ...stack) {
    return Promise.resolve(stack.find(item => {
      if (typeof item === 'object') {
        return shallowEqualObjects(item, value)
      }
      return item === value
    }) !== undefined)
  },

  /**
   * Rule: Value is not in stack.
   */
  not: function (value, ...stack) {
    return Promise.resolve(stack.find(item => {
      if (typeof item === 'object') {
        return shallowEqualObjects(item, value)
      }
      return item === value
    }) === undefined)
  },

  /**
   * Rule: Match the value against a (stack) of patterns or strings
   */
  matches: function (value, ...stack) {
    return Promise.resolve(!!stack.find(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(value)
      }
      return pattern === value
    }))
  },

  /**
   * Rule: checks if a string is a valid url
   */
  url: function (value) {
    return Promise.resolve(isUrl(value))
  },

  /**
   * Rule: ensures the value is a date according to Date.parse()
   */
  date: function (value) {
    return Promise.resolve(!isNaN(Date.parse(value)))
  },

  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  after: function (value, compare = false) {
    const timestamp = Date.parse(compare || new Date())
    const fieldValue = Date.parse(value)
    return Promise.resolve(isNaN(fieldValue) ? false : (fieldValue > timestamp))
  },

  /**
   * Rule: checks if a value is after a given date. Defaults to current time
   */
  before: function (value, compare = false) {
    const timestamp = Date.parse(compare || new Date())
    const fieldValue = Date.parse(value)
    return Promise.resolve(isNaN(fieldValue) ? false : (fieldValue < timestamp))
  },

  /**
   * Rule: checks if the value is only alpha numeric
   */
  alpha: function (value, set = 'default') {
    const sets = {
      default: /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/,
      latin: /^[a-z][A-Z]$/
    }
    const selectedSet = sets.hasOwnProperty(set) ? set : 'default'
    return Promise.resolve(sets[selectedSet].test(value))
  },

  /**
   * Rule: checks if the value is only alpha numeric
   */
  number: function (value) {
    return Promise.resolve(!isNaN(value))
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function (value, set = 'default') {
    const sets = {
      default: /^[a-zA-Z0-9À-ÖØ-öø-ÿ]+$/,
      latin: /^[a-zA-Z0-9]$/
    }
    const selectedSet = sets.hasOwnProperty(set) ? set : 'default'
    return Promise.resolve(sets[selectedSet].test(value))
  },

  /**
   * Rule: checks if the value is between two other values
   */
  between: function (value, from, to) {
    return Promise.resolve((() => {
      if (from === null || to === null || isNaN(from) || isNaN(to)) {
        return false
      }
      from = Number(from)
      to = Number(to)
      if (!isNaN(value)) {
        value = Number(value)
        return (value > from && value < to)
      }
      if (typeof value === 'string') {
        return value.length > from && value.length < to
      }
      return false
    })())
  },

  /**
   * Rule: tests
   */
  email: function (value) {
    // eslint-disable-next-line
    const isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return Promise.resolve(isEmail.test(value))
  },

  /**
   * Check the file type is correct.
   */
  mime: function (files, ...types) {
    return Promise.resolve((() => {
      if (typeof window !== 'undefined' && typeof FileReader !== 'undefined' && typeof Blob !== 'undefined') {
        for (const i in files) {
          if (!types.includes(files[i].type)) {
            return false
          }
        }
      }
      return true
    })())
  },

  /**
   * Check the minimum value of a particular.
   */
  min: function (value, minimum) {
    return Promise.resolve((() => {
      minimum = Number(minimum)
      if (!isNaN(value)) {
        value = Number(value)
        return value >= minimum
      }
      if (typeof value === 'string') {
        return value.length >= minimum
      }
      if (Array.isArray(value)) {
        return value.length >= minimum
      }
      return false
    })())
  },

  /**
   * Check the minimum value of a particular.
   */
  max: function (value, minimum) {
    return Promise.resolve((() => {
      minimum = Number(minimum)
      if (!isNaN(value)) {
        value = Number(value)
        return value <= minimum
      }
      if (typeof value === 'string') {
        return value.length <= minimum
      }
      if (Array.isArray(value)) {
        return value.length <= minimum
      }
      return false
    })())
  }
}
