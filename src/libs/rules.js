import { shallowEqualObjects } from './utils'

/**
 * Library of rules
 */
export default {
  /**
   * Rule: must be a value
   */
  required: async function (value) {
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
  },

  /**
   * Rule: Value is in an array (stack).
   */
  in: async function (value, ...stack) {
    return !!stack.find(item => shallowEqualObjects(item, value))
  },

  /**
   * Rule: Match the value against a (stack) of patterns or strings
   */
  matches: async function (value, ...stack) {
    return !!stack.find(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(value)
      }
      return pattern === value
    })
  }
}
