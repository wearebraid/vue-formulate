import { map, arrayify, shallowEqualObjects } from './utils'

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
export default {
  context () {
    return defineModel.call(this, {
      addLabel: this.logicalAddLabel,
      attributes: this.elementAttributes,
      blurHandler: blurHandler.bind(this),
      classification: this.classification,
      component: this.component,
      disableErrors: this.disableErrors,
      errors: this.explicitErrors,
      formShouldShowErrors: this.formShouldShowErrors,
      getValidationErrors: this.getValidationErrors.bind(this),
      hasGivenName: this.hasGivenName,
      hasLabel: (this.label && this.classification !== 'button'),
      hasValidationErrors: this.hasValidationErrors.bind(this),
      help: this.help,
      helpPosition: this.logicalHelpPosition,
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
      classes: this.classes,
      ...this.typeContext
    })
  },
  // Used in sub-context
  nameOrFallback,
  hasGivenName,
  typeContext,
  elementAttributes,
  logicalLabelPosition,
  logicalHelpPosition,
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
  slotComponents,
  logicalAddLabel,
  classes
}

/**
 * The label to display when adding a new group.
 */
function logicalAddLabel () {
  if (typeof this.addLabel === 'boolean') {
    return `+ ${this.label || this.name || 'Add'}`
  }
  return this.addLabel
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
  // pass the ID prop through to the root element
  if (this.id) {
    attrs.id = this.id
  } else {
    attrs.id = this.defaultId
  }
  // pass an explicitly given name prop through to the root element
  if (this.hasGivenName) {
    attrs.name = this.name
  }

  // If there is help text, have this element be described by it.
  if (this.help) {
    attrs['aria-describedby'] = `${attrs.id}-help`
  }

  return attrs
}

/**
 * Returns a map of classes for all markup in the element.
 */
function classes () {
  return {
    outer: this.$formulate.classes('input'),
    wrapper: this.$formulate.classes('wrapper')
  }
}

/**
 * Determine the best-guess location for the label (before or after).
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
 * Determine the best location for the label based on type (before or after).
 */
function logicalHelpPosition () {
  if (this.helpPosition) {
    return this.helpPosition
  }
  switch (this.classification) {
    case 'group':
      return 'before'
    default:
      return 'after'
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
 * determine if an input has a user-defined name
 */
function hasGivenName () {
  return typeof this.name !== 'boolean'
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
    addMore: this.$formulate.slotComponent(this.type, 'addMore'),
    remove: this.$formulate.slotComponent(this.type, 'remove')
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
  const model = this.isVmodeled ? 'formulateValue' : 'proxy'
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
  if (!shallowEqualObjects(value, this.proxy)) {
    this.proxy = value
  }
  this.$emit('input', value)
  if (this.context.name && typeof this.formulateSetter === 'function') {
    this.formulateSetter(this.context.name, value)
  }
}
