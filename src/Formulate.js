import library from './libs/library'
import rules from './libs/rules'
import en from './locales/en'
import FileUpload from './FileUpload'
import isPlainObject from 'is-plain-object'
import fauxUploader from './libs/faux-uploader'
import FormulateInput from './FormulateInput.vue'
import FormulateForm from './FormulateForm.vue'
import FormulateInputErrors from './FormulateInputErrors.vue'
import FormulateInputGroup from './FormulateInputGroup.vue'
import FormulateInputBox from './inputs/FormulateInputBox.vue'
import FormulateInputText from './inputs/FormulateInputText.vue'
import FormulateInputFile from './inputs/FormulateInputFile.vue'
import FormulateInputSelect from './inputs/FormulateInputSelect.vue'
import FormulateInputSlider from './inputs/FormulateInputSlider.vue'
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
        FormulateInputErrors,
        FormulateInputBox,
        FormulateInputText,
        FormulateInputFile,
        FormulateInputGroup,
        FormulateInputSelect,
        FormulateInputSlider,
        FormulateInputTextArea
      },
      library,
      rules,
      locale: 'en',
      uploader: fauxUploader,
      uploadJustCompleteDuration: 1000,
      locales: {
        en
      }
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
    Object.freeze(this)
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

  /**
   * Get validation rules.
   * @return {object} object of validation functions
   */
  rules () {
    return this.options.rules
  }

  /**
   * Get the validation message for a particular error.
   */
  validationMessage (rule, validationContext) {
    const generators = this.options.locales[this.options.locale]
    if (generators.hasOwnProperty(rule)) {
      return generators[rule](validationContext)
    } else if (rule[0] === '_' && generators.hasOwnProperty(rule.substr(1))) {
      return generators[rule.substr(1)](validationContext)
    }
    if (generators.hasOwnProperty('default')) {
      return generators.default(validationContext)
    }
    return 'This field does not have a valid value'
  }

  /**
   * Get the file uploader.
   */
  getUploader () {
    return this.options.uploader || false
  }

  /**
   * Create a new instance of an upload.
   */
  createUpload (fileList, context) {
    return new FileUpload(fileList, context, this.options)
  }
}

export default new Formulate()
