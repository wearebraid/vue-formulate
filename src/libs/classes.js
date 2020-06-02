/**
 * A list of available class keys in core. These can be added to by extending
 * the `classKeys` global option when registering formulate.
 */
export const classKeys = [
  // Globals
  'outer',
  'wrapper',
  'label',
  'element',
  'input',
  'help',
  'errors',
  'error',
  // Box
  'decorator',
  // Slider
  'rangeValue',
  // File
  'uploadArea',
  'uploadAreaMasks',
  'files',
  'file',
  'fileName',
  'fileRemove',
  'fileProgress',
  'fileProgressInner',
  // Groups
  'group',
  'grouping',
  'repeatable',
  'groupRemove',
  'addMore'
]

/**
 * This function is responsible for providing VueFormulate’s default classes.
 * This function is called with the specific classKey ('wrapper' for example)
 * that it needs to generate classes for, and the context object. It always
 * returns an array.
 *
 * @param {string} classKey
 * @param {Object} context
 */
const classGenerator = (classKey, context) => {
  // camelCase to dash-case
  const key = classKey.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
  const prefix = key.substr(0, 4) === 'file' ? '' : 'input'
  const base = `formulate-${prefix}${key !== 'outer' ? `-${key}` : ''}`
  return [base].concat(classModifiers(base, classKey, context))
}

/**
 * Given a class key and a modifier, produce any additional classes.
 * @param {string} classKey
 * @param {Object} context
 */
const classModifiers = (base, classKey, context) => {
  const modifiers = []
  switch (classKey) {
    case 'label':
      modifiers.push(`${base}--${context.labelPosition}`)
      break
    case 'element':
      modifiers.push(`${base}--${context.type}`)
      break
    case 'help':
      modifiers.push(`${base}--${context.helpPosition}`)
  }
  return modifiers
}

/**
 * Function that produces all available classes.
 * @param {Object} context
 */
export default function (context) {
  return classKeys.reduce((classes, classKey) => Object.assign(classes, {
    [classKey]: classGenerator(classKey, context)
  }), {})
}
