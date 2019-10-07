
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
