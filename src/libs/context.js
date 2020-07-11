import { map, arrayify, shallowEqualObjects, isEmpty, camel } from './utils'
import { classProps } from './classes'

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
      hasValue: this.hasValue,
      hasLabel: (this.label && this.classification !== 'button'),
      hasValidationErrors: this.hasValidationErrors.bind(this),
      help: this.help,
      helpPosition: this.logicalHelpPosition,
      id: this.id || this.defaultId,
      isValid: this.isValid,
      imageBehavior: this.imageBehavior,
      label: this.label,
      labelPosition: this.logicalLabelPosition,
      limit: this.limit === Infinity ? this.limit : parseInt(this.limit, 10),
      name: this.nameOrFallback,
      minimum: parseInt(this.minimum, 10),
      performValidation: this.performValidation.bind(this),
      pseudoProps: this.pseudoProps,
      preventWindowDrops: this.preventWindowDrops,
      repeatable: this.repeatable,
      rootEmit: this.$emit.bind(this),
      setErrors: this.setErrors.bind(this),
      showValidationErrors: this.showValidationErrors,
      slotComponents: this.slotComponents,
      slotProps: this.slotProps,
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
  // Used in context
  nameOrFallback,
  hasGivenName,
  typeContext,
  elementAttributes,
  logicalLabelPosition,
  logicalHelpPosition,
  mergedUploadUrl,
  hasValue,
  visibleValidationErrors,
  slotComponents,
  logicalAddLabel,
  classes,
  showValidationErrors,
  slotProps,
  pseudoProps,
  isValid,

  // Not used in context
  isVmodeled,
  mergedValidationName,
  explicitErrors,
  allErrors,
  hasVisibleErrors,
  hasErrors,
  filteredAttributes,
  typeProps,
  listeners
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
 * Extract a set of attributes.
 * @param {string} keysToExtract
 */
function extractAttributes (obj, keys) {
  return Object.keys(obj).reduce((props, key) => {
    // All class keys are "pseudo props"
    const propKey = camel(key)
    if (keys.includes(propKey)) {
      props[propKey] = obj[key]
    }
    return props
  }, {})
}

/**
 * Items in $attrs that are better described as props.
 */
function pseudoProps () {
  // Remove any "class key props" from the attributes.
  return extractAttributes(this.localAttributes, classProps)
}

/**
 * Remove props that are defined as slot props.
 */
function typeProps () {
  return extractAttributes(this.localAttributes, this.$formulate.typeProps(this.type))
}

/**
 * Attributes with pseudoProps filtered out.
 */
function filteredAttributes () {
  const filterKeys = Object.keys(this.pseudoProps)
    .concat(Object.keys(this.typeProps))
  return Object.keys(this.localAttributes).reduce((props, key) => {
    if (!filterKeys.includes(camel(key))) {
      props[key] = this.localAttributes[key]
    }
    return props
  }, {})
}

/**
 * Reducer for attributes that will be applied to each core input element.
 * @return {object}
 */
function elementAttributes () {
  const attrs = Object.assign({}, this.filteredAttributes)
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

  // Ensure we dont have a class attribute unless we are actually applying classes.
  if (this.classes.input && (!Array.isArray(this.classes.input) || this.classes.input.length)) {
    attrs.class = this.classes.input
  }

  // @todo Filter out "local props" for custom inputs.

  return attrs
}

/**
 * Apply the result of the classes computed prop to any existing prop classes.
 */
function classes () {
  return this.$formulate.classes({
    ...this.$props,
    ...this.pseudoProps,
    ...{
      classification: this.classification,
      hasErrors: this.hasVisibleErrors,
      hasValue: this.hasValue,
      helpPosition: this.logicalHelpPosition,
      isValid: this.isValid,
      labelPosition: this.logicalLabelPosition,
      type: this.type,
      value: this.proxy
    }
  })
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
    const id = this.id || this.elementAttributes.id.replace(/[^0-9]/g, '')
    return `${this.type}_${id}`
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
 * Determines if the current input has a value or not. To do this we need to
 * check for various falsey values. But we cannot assume that all falsey values
 * mean an empty or unselected field (for example 0) and we cant assume that
 * all truthy values are empty like [] or {}.
 */
function hasValue () {
  const value = this.proxy
  if (this.classification === 'box' && this.isGrouped) {
    return Array.isArray(value) ? value.some(v => v === this.value) : this.value === value
  }
  return !isEmpty(value)
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
 * True when the field has no errors at all.
 */
function isValid () {
  return !this.hasErrors
}

/**
 * Returns if form has actively visible errors (of any kind)
 */
function hasVisibleErrors () {
  return (
    (Array.isArray(this.validationErrors) && this.validationErrors.length && this.showValidationErrors) ||
    !!this.explicitErrors.length
  )
}

/**
 * The component that should be rendered in the label slot as default.
 */
function slotComponents () {
  const fn = this.$formulate.slotComponent.bind(this.$formulate)
  return {
    label: fn(this.type, 'label'),
    help: fn(this.type, 'help'),
    errors: fn(this.type, 'errors'),
    repeatable: fn(this.type, 'repeatable'),
    addMore: fn(this.type, 'addMore'),
    remove: fn(this.type, 'remove')
  }
}

/**
 * Any extra props to pass to slot components.
 */
function slotProps () {
  const fn = this.$formulate.slotProps.bind(this.$formulate)
  return {
    label: fn(this.type, 'label', this.typeProps),
    help: fn(this.type, 'help', this.typeProps),
    errors: fn(this.type, 'errors', this.typeProps),
    repeatable: fn(this.type, 'repeatable', this.typeProps),
    addMore: fn(this.type, 'addMore', this.typeProps),
    remove: fn(this.type, 'remove', this.typeProps)
  }
}

/**
 * Bound into the context object.
 */
function blurHandler () {
  if (this.errorBehavior === 'blur') {
    this.behavioralErrorVisibility = true
  }
}

/**
 * Bound listeners.
 */
function listeners () {
  const { input, ...listeners } = this.$listeners
  return listeners
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
  if (!this[model] && this[model] !== 0) {
    return ''
  }
  return this[model]
}

/**
 * Set the value from a model.
 **/
function modelSetter (value) {
  let didUpdate = false
  if (!shallowEqualObjects(value, this.proxy)) {
    this.proxy = value
    didUpdate = true
  }
  if (this.context.name && typeof this.formulateSetter === 'function') {
    this.formulateSetter(this.context.name, value)
  }
  if (didUpdate) {
    this.$emit('input', value)
  }
}
