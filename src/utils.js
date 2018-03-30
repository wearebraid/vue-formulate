import cloneDeep from 'clone-deep'

/**
 * Compare the equality of two arrays.
 * @param {Array} arr1
 * @param {Array} arr2
 */
export function equals (arr1, arr2) {
  var length = arr1.length
  if (length !== arr2.length) return false
  for (var i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

/**
 * Function to map over an object.
 * @param {Object} obj An object to map over
 * @param {Function} callback
 */
export function map (original, callback) {
  let obj = cloneDeep(original)
  for (let key in obj) {
    obj[key] = callback(key, obj[key])
  }
  return obj
}

/**
 * Function to filter an object's properties
 * @param {Object} original
 * @param {Function} callback
 */
export function filter (original, callback) {
  let obj = {}
  for (let key in original) {
    if (callback(key, original[key])) {
      obj[key] = original[key]
    }
  }
  return obj
}

/**
 * Function to reduce an object's properties
 * @param {Object} original
 * @param {Function} callback
 * @param {*} accumulator
 */
export function reduce (original, callback, accumulator) {
  for (let key in original) {
    accumulator = callback(accumulator, key, original[key])
  }
  return accumulator
}

/**
 * Comprehensive list of input types supported.
 */
export const inputTypes = {
  text: [
    'text',
    'email',
    'number',
    'color',
    'date',
    'datetime-local',
    'hidden',
    'month',
    'password',
    'range',
    'search',
    'tel',
    'time',
    'url',
    'week'
  ],
  button: [
    'submit',
    'button'
  ],
  select: [
    'select'
  ],
  box: [
    'radio',
    'checkbox'
  ],
  textarea: [
    'textarea'
  ]
}
