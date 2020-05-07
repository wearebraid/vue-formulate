import { map, arrayify, shallowEqualObjects } from './utils'

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
export default {
  context () {
    return defineModel.call(this, {
      attributes: this.elementAttributes,
      blurHandler: blurHandler.bind(this),
      classification: this.classification,
      component: this.component,
      disableErrors: this.disableErrors,
      errors: this.explicitErrors,
      getValidationErrors: this.getValidationErrors.bind(this),
      hasLabel: (this.label && this.classification !== 'button'),
      hasValidationErrors: this.hasValidationErrors.bind(this),
      help: this.help,
      id: this.id || this.defaultId,
      imageBehavior: this.imageBehavior,
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      limit: this.limit,
      name: this.nameOrFallback,
      performValidation: this.performValidation.bind(this),
      preventWindowDrops: this.preventWindowDrops,
      repeatable: this.repeatable,
      setErrors: this.setErrors.bind(this),
      showValidationErrors: this.showValidationErrors,
      slotComponents: this.slotComponents,
      type: this.type,
      uploadBehavior: this.uploadBehavior,
      uploadUrl: this.mergedUploadUrl,
      uploader: this.uploader || this.$formulate.getUploader(),
      validationErrors: this.validationErrors,
      value: this.value,
      visibleValidationErrors: this.visibleValidationErrors,
      isSubField: this.isSubField,
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
  showValidationErrors,
  visibleValidationErrors,
  slotComponents
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
  if (this.classification === 'file' && this.uploadBehavior === 'live' && modelGetter.call(this)) {
    return true
  }
  return this.behavioralErrorVisibility
}

/**
 * All of the currently visible validation errors (does not include error handling)
 * @return {array}
 */
function visibleValidationErrors () {
  return (this.showValidationErrors && this.validationErrors.length) ? this.validationErrors : []
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
    .concat(this.localErrors)
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
 * Returns if form has actively visible errors (of any kind)
 */
function hasVisibleErrors () {
  return ((this.validationErrors && this.showValidationErrors) || !!this.explicitErrors.length)
}

/**
 * The component that should be rendered in the label slot as default.
 */
function slotComponents () {
  return {
    label: this.$formulate.slotComponent(this.type, 'label'),
    help: this.$formulate.slotComponent(this.type, 'help'),
    errors: this.$formulate.slotComponent(this.type, 'errors'),
    repeatable: this.$formulate.slotComponent(this.type, 'repeatable'),
    addMore: this.$formulate.slotComponent(this.type, 'addMore')
  }
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
  if (this.context.name && typeof this.formulateSetter === 'function') {
    this.formulateSetter(this.context.name, value)
  }
}
