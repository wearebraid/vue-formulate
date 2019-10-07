import {map, reduce, filter} from './utils'

/**
 * Curried function for creating the formState
 * @param {Object} options
 */
export const formulateState = (options = {}) => () => Object.assign({
  values: {},
  errors: {},
  validationErrors: {},
  meta: {}
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
  formMeta (state) {
    return reduce(state.meta, (forms, form, fields) => {
      forms[form] = reduce(fields, (arr, field, data) => arr.concat(data), [])
      return forms
    }, {})
  },
  hasErrors (state) {
    return map(state.errors, (form, errors) => {
      return reduce(errors, (hasErrors, field, errors) => hasErrors || !!errors.length, false)
    })
  },
  hasValidationErrors (state) {
    return map(state.validationErrors, (form, errors) => {
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
  },
  setFieldMeta (state, {form, field, data}) {
    state.meta = Object.assign({}, state.meta, {
      [form]: Object.assign({}, state.meta[form] || {}, {[field]: data})
    })
  },
  resetForm (state, form) {
    if (state.values[form]) {
      state.values = Object.assign({}, state.values, {
        [form]: map(state.values[form], (key, value) => undefined)
      })
    }
  },
  removeField (state, {form, field}) {
    for (let group in state) {
      if (state[group][form] && state[group][form].hasOwnProperty(field)) {
        state[group][form] = filter(state[group][form], (key, value) => key !== field)
      }
    }
  },
  removeFieldValidationErrors (state, {form, field}) {
    state.validationErrors = Object.assign({}, state.validationErrors, {
      [form]: filter(state.validationErrors[form] || {}, key => key !== field)
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
