import nanoid from 'nanoid/non-secure'
import { map, arrayify, shallowEqualObjects } from './utils'

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
export default {
  context () {
    return defineModel.call(this, {
      type: this.type,
      value: this.value,
      name: this.nameOrFallback,
      classification: this.classification,
      component: this.component,
      id: this.id || this.defaultId,
      hasLabel: (this.label && this.classification !== 'button'),
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      attributes: this.elementAttributes,
      performValidation: this.performValidation.bind(this),
      blurHandler: blurHandler.bind(this),
      imageBehavior: this.imageBehavior,
      uploadUrl: this.mergedUploadUrl,
      uploader: this.uploader || this.$formulate.getUploader(),
      uploadBehavior: this.uploadBehavior,
      preventWindowDrops: this.preventWindowDrops,
      hasValidationErrors: this.hasValidationErrors,
      ...this.typeContext
    })
  },
  // Used in sub-context
  nameOrFallback,
  typeContext,
  elementAttributes,
  logicalLabelPosition,
  mergedUploadUrl,

  // These items are not passed as context
  isVmodeled,
  mergedValidationName,
  explicitErrors,
  allErrors,
  hasErrors,
  hasVisibleErrors,
  showValidationErrors
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
    case 'slider':
      return { showValue: !!this.showValue }
    default:
      if (this.options) {
        return {
          options: createOptionList.call(this, this.options)
        }
      }
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
 * The validation label to use.
 */
function mergedValidationName () {
  if (this.validationName) {
    return this.validationName
  }
  if (typeof this.name === 'string') {
    return this.name
  }
  if (this.label) {
    return this.label
  }
  return this.type
}

/**
 * Use the uploadURL on the input if it exists, otherwise use the uploadURL
 * that is defined as a plugin option.
 */
function mergedUploadUrl () {
  return this.uploadUrl || this.$formulate.getUploadUrl()
}

/**
 * Determines if the field should show it's error (if it has one)
 * @return {boolean}
 */
function showValidationErrors () {
  if (this.showErrors || this.formShouldShowErrors) {
    return true
  }
  if (this.classification === 'file' && this.uploadBehavior === 'live' && this.context.model) {
    return true
  }
  return this.behavioralErrorVisibility
}

/**
 * Return the element’s name, or select a fallback.
 */
function nameOrFallback () {
  if (this.name === true && this.classification !== 'button') {
    return `${this.type}_${this.elementAttributes.id}`
  }
  if (this.name === false || (this.classification === 'button' && this.name === true)) {
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
  }
  return options
}

/**
 * These are errors we that have been explicity passed to us.
 */
function explicitErrors () {
  return arrayify(this.errors)
    .concat(arrayify(this.error))
}

/**
 * The merged errors computed property.
 */
function allErrors () {
  return this.explicitErrors
    .concat(arrayify(this.validationErrors))
}

/**
 * Does this computed property have errors
 */
function hasErrors () {
  return !!this.allErrors.length
}

/**
 * Checks if form has actively visible errors.
 */
function hasVisibleErrors () {
  return ((this.validationErrors && this.showValidationErrors) || !!this.explicitErrors.length)
}

/**
 * Bound into the context object.
 */
function blurHandler () {
  this.$emit('blur')
  if (this.errorBehavior === 'blur') {
    this.behavioralErrorVisibility = true
  }
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
  if (!shallowEqualObjects(value, this.internalModelProxy)) {
    this.internalModelProxy = value
  }
  this.$emit('input', value)
  if (this.context.name && typeof this.formulateFormSetter === 'function') {
    this.formulateFormSetter(this.context.name, value)
  }
}
