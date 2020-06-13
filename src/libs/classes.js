import { arrayify } from './utils'

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
  'uploadAreaMask',
  'files',
  'file',
  'fileName',
  'fileRemove',
  'fileProgress',
  'fileUploadError',
  'fileImagePreview',
  'fileProgressInner',
  // Groups
  'grouping',
  'groupRepeatable',
  'groupRepeatableRemove',
  'groupAddMore'
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
  const prefix = key.substr(0, 4) === 'file' ? '' : '-input'
  const element = ['decorator', 'range-value'].includes(key) ? '-element' : ''
  const base = `formulate${prefix}${element}${key !== 'outer' ? `-${key}` : ''}`
  return key === 'input' ? [] : [base].concat(classModifiers(base, classKey, context))
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
      const type = context.classification === 'group' ? 'group' : context.type
      modifiers.push(`${base}--${type}`)
      // @todo DEPRECATED! This should be removed in a future version:
      if (type === 'group') {
        modifiers.push('formulate-input-group')
      }
      break
    case 'help':
      modifiers.push(`${base}--${context.helpPosition}`)
  }
  return modifiers
}

/**
 * Generate a list of all the class props to accept.
 */
export function classProps () {
  return classKeys.reduce((props, classKey) => {
    return Object.assign(props, { [`${classKey}Class`]: {
      type: [Array, Boolean, Function, String],
      default: false
    } })
  }, {})
}

/**
 * Given a string or array of classes and a modifier (function, string etc) apply
 * the modifications.
 *
 * @param {mixed} baseClass The initial class for a given key
 * @param {mixed} modifier A function, string, array etc that can be a class prop.
 * @param {Object} context The class context
 */
export function applyClasses (baseClass, modifier, context) {
  switch (typeof modifier) {
    case 'string':
      return modifier
    case 'function':
      return modifier(context, arrayify(baseClass))
    case 'object':
      if (Array.isArray(modifier)) {
        return arrayify(baseClass).concat(modifier)
      }
    /** allow fallthrough if object that isn’t an array */
    default:
      return baseClass
  }
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
