import library from './libs/library'
import isPlainObject from 'is-plain-object'
import FormulateInput from './FormulateInput.vue'
import FormulateForm from './FormulateForm.vue'
import FormulateInputGroup from './FormulateInputGroup.vue'
import FormulateInputBox from './inputs/FormulateInputBox.vue'
import FormulateInputText from './inputs/FormulateInputText.vue'
import FormulateInputSelect from './inputs/FormulateInputSelect.vue'
import FormulateInputTextArea from './inputs/FormulateInputTextArea.vue'
/**
 * The base formulate library.
 */
class Formulate {
  /**
   * Instantiate our base options.
   */
  constructor () {
    this.defaults = {
      components: {
        FormulateForm,
        FormulateInput,
        FormulateInputBox,
        FormulateInputText,
        FormulateInputGroup,
        FormulateInputSelect,
        FormulateInputTextArea
      },
      library
    }
  }

  /**
   * Install vue formulate, and register it’s components.
   */
  install (Vue, options) {
    Vue.prototype.$formulate = this
    this.options = this.extend(this.defaults, options || {})
    for (var componentName in this.options.components) {
      Vue.component(componentName, this.options.components[componentName])
    }
  }

  /**
   * Create a new object by copying properties of base and extendWith.
   * @param {Object} base
   * @param {Object} extendWith
   */
  extend (base, extendWith) {
    var merged = {}
    for (var key in base) {
      if (extendWith.hasOwnProperty(key)) {
        merged[key] = isPlainObject(extendWith[key]) && isPlainObject(base[key])
          ? this.extend(base[key], extendWith[key])
          : extendWith[key]
      } else {
        merged[key] = base[key]
      }
    }
    for (var prop in extendWith) {
      if (!merged.hasOwnProperty(prop)) {
        merged[prop] = extendWith[prop]
      }
    }
    return merged
  }

  /**
   * Determine what "class" of input this element is given the "type".
   * @param {string} type
   */
  classify (type) {
    if (this.options.library.hasOwnProperty(type)) {
      return this.options.library[type].classification
    }
    return 'unknown'
  }

  /**
   * Determine what type of component to render given the "type".
   * @param {string} type
   */
  component (type) {
    if (this.options.library.hasOwnProperty(type)) {
      return this.options.library[type].component
    }
    return false
  }
}

export default new Formulate()
