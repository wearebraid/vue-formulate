import nanoid from 'nanoid'
import { map, arrayify, parseRules } from './utils'

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
export default {
  context () {
    if (this.debug) {
      console.log(`${this.type} re-context`)
    }
    return defineModel.call(this, {
      type: this.type,
      value: this.value,
      name: this.nameOrFallback,
      classification: this.classification,
      component: this.component,
      id: this.id || this.defaultId,
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      attributes: this.elementAttributes,
      ...this.typeContext
    })
  },
  nameOrFallback,
  typeContext,
  elementAttributes,
  logicalLabelPosition,
  isVmodeled,
  mergedErrors,
  hasErrors,
  validationRules
}

/**
 * Given (this.type), return an object to merge with the context
 * @return {object}
 * @return {object}
 */
function typeContext () {
  switch (this.classification) {
    case 'select':
      return {
        options: createOptionList.call(this, this.options),
        optionGroups: this.optionGroups ? map(this.optionGroups, (k, v) => createOptionList.call(this, v)) : false,
        placeholder: this.$attrs.placeholder || false
      }
    case 'group':
      if (this.options) {
        return {
          options: createOptionList.call(this, this.options)
        }
      }
      break
    default:
      return {}
  }
}

/**
 * Reducer for attributes that will be applied to each core input element.
 * @return {object}
 */
function elementAttributes () {
  const attrs = Object.assign({}, this.localAttributes)
  if (this.id) {
    attrs.id = this.id
  } else {
    attrs.id = this.defaultId
  }
  return attrs
}

/**
 * Determine the a best-guess location for the label (before or after).
 * @return {string} before|after
 */
function logicalLabelPosition () {
  if (this.labelPosition) {
    return this.labelPosition
  }
  switch (this.classification) {
    case 'box':
      return 'after'
    default:
      return 'before'
  }
}

/**
 * Return the element’s name, or select a fallback.
 */
function nameOrFallback () {
  if (this.name === true) {
    return `${this.type}_${this.elementAttributes.id}`
  }
  if (this.name === false) {
    return false
  }
  return this.name
}

/**
 * Determines if this formulate element is v-modeled or not.
 */
function isVmodeled () {
  return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
    this._events &&
    Array.isArray(this._events.input) &&
    this._events.input.length)
}

/**
 * Given an object or array of options, create an array of objects with label,
 * value, and id.
 * @param {array|object}
 * @return {array}
 */
function createOptionList (options) {
  if (!Array.isArray(options) && options && typeof options === 'object') {
    const optionList = []
    const that = this
    for (const value in options) {
      optionList.push({ value, label: options[value], id: `${that.elementAttributes.id}_${value}` })
    }
    return optionList
  } else if (Array.isArray(options) && !options.length) {
    return [{ value: this.value, label: (this.label || this.name), id: this.context.id || nanoid(9) }]
  }
  return options
}

/**
 * The merged errors computed property.
 */
function mergedErrors () {
  return arrayify(this.errors)
    .concat(arrayify(this.error))
    .concat(arrayify(this.validationErrors))
    .reduce((errors, err) => !errors.includes(err) ? errors.concat(err) : errors, [])
}

/**
 * Does this computed property have errors.
 */
function hasErrors () {
  return !!this.mergedErrors.length
}

/**
 * An array of validation rules to pass.
 */
function validationRules () {
  return parseRules(this.validation)
}

/**
 * Defines the model used throughout the existing context.
 * @param {object} context
 */
function defineModel (context) {
  return Object.defineProperty(context, 'model', {
    get: modelGetter.bind(this),
    set: modelSetter.bind(this)
  })
}

/**
 * Get the value from a model.
 **/
function modelGetter () {
  const model = this.isVmodeled ? 'formulateValue' : 'internalModelProxy'
  if (this.type === 'checkbox' && !Array.isArray(this[model]) && this.options) {
    return []
  }
  if (!this[model]) {
    return ''
  }
  return this[model]
}

/**
 * Set the value from a model.
 **/
function modelSetter (value) {
  this.internalModelProxy = value
  this.$emit('input', value)
  if (this.context.name && typeof this.formulateFormSetter === 'function') {
    this.formulateFormSetter(this.context.name, value)
  }
}
