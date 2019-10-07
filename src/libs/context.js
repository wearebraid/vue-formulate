import nanoid from 'nanoid'
import { reduce, map } from './utils'

/**
 * For a single instance of an input, export all of the context needed to fully
 * render that element.
 * @return {object}
 */
export default function context () {
  return defineModel.call(this, Object.assign({
    type: this.type,
    value: this.value,
    classification: this.classification,
    component: this.component,
    id: this.id,
    label: this.label,
    labelPosition: labelPosition.call(this),
    attributes: attributeReducer.call(this, this.$attrs)
  }, typeContext.call(this)))
}

/**
 * Given (this.type), return an object to merge with the context
 * @return {object}
 */
function typeContext () {
  switch (this.classification) {
    case 'select':
      return {
        options: createOptionList(this.options),
        optionGroups: this.optionGroups ? map(this.optionGroups, (k, v) => createOptionList(v)) : false,
        placeholder: this.$attrs.placeholder || false
      }
    case 'group':
      if (this.options) {
        return {
          options: createOptionList(this.options),
          component: 'FormulateInputGroup'
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
function attributeReducer (attributes = {}) {
  if (this.id) {
    attributes.id = this.id
  }
  return attributes
}

/**
 * Determine the a best-guess location for the label (before or after).
 * @return {string} before|after
 */
function labelPosition () {
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
 * Given an object or array of options, create an array of objects with label,
 * value, and id.
 * @param {array|object}
 * @return {array}
 */
function createOptionList (options) {
  if (!Array.isArray(options)) {
    return reduce(options, (options, value, label) => options.concat({ value, label, id: nanoid(15) }), [])
  } else if (Array.isArray(options) && !options.length) {
    return [{ value: this.name, label: (this.label || this.name), id: nanoid(15) }]
  }
  return options
}

/**
 * Create a getter/setter model factory
 * @return object
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
  if (this.type === 'checkbox' && !Array.isArray(this.formulateValue) && this.options) {
    return []
  }
  if (this.formulateValue === false) {
    return ''
  }
  return this.formulateValue
}

/**
 * Set the value from a model.
 **/
function modelSetter (value) {
  this.$emit('input', value)
}
