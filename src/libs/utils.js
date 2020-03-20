import FileUpload from '../FileUpload'

/**
 * Function to map over an object.
 * @param {Object} obj An object to map over
 * @param {Function} callback
 */
export function map (original, callback) {
  const obj = {}
  for (let key in original) {
    obj[key] = callback(key, original[key])
  }
  return obj
}

/**
 * Shallow equal.
 * @param {} objA
 * @param {*} objB
 */
export function shallowEqualObjects (objA, objB) {
  if (objA === objB) {
    return true
  }
  if (!objA || !objB) {
    return false
  }
  var aKeys = Object.keys(objA)
  var bKeys = Object.keys(objB)
  var len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i]

    if (objA[key] !== objB[key]) {
      return false
    }
  }
  return true
}

/**
 * Given a string, convert snake_case to camelCase
 * @param {String} string
 */
export function snakeToCamel (string) {
  if (typeof string === 'string') {
    return string.replace(/([_][a-z0-9])/ig, ($1) => {
      if (string.indexOf($1) !== 0 && string[string.indexOf($1) - 1] !== '_') {
        return $1.toUpperCase().replace('_', '')
      }
      return $1
    })
  }
  return string
}

/**
 * Given a string, object, falsey, or array - return an array.
 * @param {mixed} item
 */
export function arrayify (item) {
  if (!item) {
    return []
  }
  if (typeof item === 'string') {
    return [item]
  }
  if (Array.isArray(item)) {
    return item
  }
  if (typeof item === 'object') {
    return Object.values(item)
  }
  return []
}

/**
 * Given an array or string return an array of callables.
 * @param {array|string} validation
 * @param {array} rules and array of functions
 * @return {array} an array of functions
 */
export function parseRules (validation, rules) {
  if (typeof validation === 'string') {
    return parseRules(validation.split('|'), rules)
  }
  if (!Array.isArray(validation)) {
    return []
  }
  return validation.map(rule => parseRule(rule, rules)).filter(f => !!f)
}

/**
 * Given a string or function, parse it and return an array in the format
 * [fn, [...arguments]]
 * @param {string|function} rule
 */
function parseRule (rule, rules) {
  if (typeof rule === 'function') {
    return [rule, []]
  }
  if (Array.isArray(rule) && rule.length) {
    rule = rule.map(r => r) // light clone
    const ruleName = snakeToCamel(rule.shift())
    if (typeof ruleName === 'string' && rules.hasOwnProperty(ruleName)) {
      return [rules[ruleName], rule, ruleName]
    }
    if (typeof ruleName === 'function') {
      return [ruleName, rule, ruleName]
    }
  }
  if (typeof rule === 'string') {
    const segments = rule.split(':')
    const ruleName = snakeToCamel(segments.shift())
    if (rules.hasOwnProperty(ruleName)) {
      return [rules[ruleName], segments.length ? segments.join(':').split(',') : [], ruleName]
    } else {
      throw new Error(`Unknown validation rule ${rule}`)
    }
  }
  return false
}

/**
 * Escape a string for use in regular expressions.
 * @param {string} string
 */
export function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

/**
 * Given a string format (date) return a regex to match against.
 * @param {string} format
 */
export function regexForFormat (format) {
  let escaped = `^${escapeRegExp(format)}$`
  const formats = {
    MM: '(0[1-9]|1[012])',
    M: '([1-9]|1[012])',
    DD: '([012][1-9]|3[01])',
    D: '([012]?[1-9]|3[01])',
    YYYY: '\\d{4}',
    YY: '\\d{2}'
  }
  return new RegExp(Object.keys(formats).reduce((regex, format) => {
    return regex.replace(format, formats[format])
  }, escaped))
}

/**
 * Check if
 * @param {mixed} data
 */
export function isValueType (data) {
  switch (typeof data) {
    case 'symbol':
    case 'number':
    case 'string':
    case 'boolean':
    case 'undefined':
      return true
    default:
      if (data === null) {
        return true
      }
      return false
  }
}

/**
 * A simple (somewhat non-comprehensive) cloneDeep function, valid for our use
 * case of needing to unbind reactive watchers.
 */
export function cloneDeep (obj) {
  const newObj = {}
  for (const key in obj) {
    if (obj[key] instanceof FileUpload || isValueType(obj[key])) {
      newObj[key] = obj[key]
    } else {
      newObj[key] = cloneDeep(obj[key])
    }
  }
  return newObj
}

/**
 * Given a locale string, parse the options.
 * @param {string} locale
 */
export function parseLocale (locale) {
  const segments = locale.split('-')
  return segments.reduce((options, segment) => {
    if (options.length) {
      options.unshift(`${options[0]}-${segment}`)
    }
    return options.length ? options : [segment]
  }, [])
}
