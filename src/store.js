import {map, reduce} from './utils'

/**
 * Curried function for creating the formState
 * @param {Object} options
 */
export const formulateState = (options = {}) => () => Object.assign({
  values: {},
  errors: {},
  validationErrors: {}
}, options)

/**
 * Function for creating the formGetters
 * @param {string} module
 * @param {Object} getters
 */
export const formulateGetters = (moduleName = '', getters = {}) => Object.assign({
  formValues (state) {
    return state.values
  },
  formErrors (state) {
    return state.errors
  },
  formValidationErrors (state) {
    return state.validationErrors
  },
  hasErrors (state) {
    return map(state.errors, (form, errors) => {
      return reduce(errors, (hasErrors, field, errors) => hasErrors || !!errors.length, false)
    })
  }
}, getters)

/**
 * Function for creating the formActions
 * @param {string} moduleName
 * @param {Object} actions
 */
export const formulateActions = (moduleName = '', actions = {}) => Object.assign({
}, actions)

/**
 * Function for creating the formMutations
 * @param {Object} mutations
 */
export const formulateMutations = (mutations = {}) => Object.assign({
  setFieldValue (state, {form, field, value}) {
    state.values = Object.assign({}, state.values, {
      [form]: Object.assign({}, state.values[form] || {}, {[field]: value})
    })
  },
  setFieldErrors (state, {form, field, errors}) {
    state.errors = Object.assign({}, state.errors, {
      [form]: Object.assign({}, state.errors[form] || {}, {[field]: errors})
    })
  },
  setFieldValidationErrors (state, {form, field, errors}) {
    state.validationErrors = Object.assign({}, state.validationErrors, {
      [form]: Object.assign({}, state.validationErrors[form] || {}, {[field]: errors})
    })
  }
}, mutations)

/**
 * Function for exposing a full vuex module.
 * @param {string} moduleName
 * @param {Object} validation
 */
export const formulateModule = (moduleName) => ({
  state: formulateState(),
  getters: formulateGetters(moduleName),
  actions: formulateActions(moduleName),
  mutations: formulateMutations(),
  namespaced: true
})
