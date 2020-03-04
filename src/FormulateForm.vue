<template>
  <form
    @submit.prevent="formSubmitted"
  >
    <FormulateErrors
      v-if="!errorObservers.length"
      type="form"
      :errors="formErrors"
      :prevent-registration="true"
    />
    <slot />
  </form>
</template>

<script>
import { shallowEqualObjects } from './libs/utils'
import FormSubmission from './FormSubmission'

export default {
  provide () {
    return {
      formulateFormSetter: this.setFieldValue,
      formulateFormRegister: this.register,
      getFormValues: this.getFormValues,
      observeErrors: this.addErrorObserver,
      removeErrorObserver: this.removeErrorObserver
    }
  },
  name: 'FormulateForm',
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    name: {
      type: [String, Boolean],
      default: false
    },
    formulateValue: {
      type: Object,
      default: () => ({})
    },
    values: {
      type: [Object, Boolean],
      default: false
    },
    errors: {
      type: [Object, Boolean],
      default: false
    }
  },
  data () {
    return {
      registry: {},
      internalFormModelProxy: {},
      formShouldShowErrors: false,
      errorObservers: [],
      formErrors: [],
      fieldErrors: {}
    }
  },
  computed: {
    hasInitialValue () {
      return (
        (this.formulateValue && typeof this.formulateValue === 'object') ||
        (this.values && typeof this.values === 'object')
      )
    },
    isVmodeled () {
      return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
        this._events &&
        Array.isArray(this._events.input) &&
        this._events.input.length)
    },
    initialValues () {
      if (
        Object.prototype.hasOwnProperty.call(this.$options.propsData, 'formulateValue') &&
        typeof this.formulateValue === 'object'
      ) {
        // If there is a v-model on the form, use those values as first priority
        return Object.assign({}, this.formulateValue) // @todo - use a deep clone to detach reference types
      } else if (
        Object.prototype.hasOwnProperty.call(this.$options.propsData, 'values') &&
        typeof this.values === 'object'
      ) {
        // If there are values, use them as secondary priority
        return Object.assign({}, this.values)
      }
      return {}
    }
  },
  watch: {
    formulateValue: {
      handler (newValue, oldValue) {
        if (this.isVmodeled &&
          newValue &&
          typeof newValue === 'object'
        ) {
          for (const field in newValue) {
            if (this.registry.hasOwnProperty(field) &&
              !shallowEqualObjects(newValue[field], this.internalFormModelProxy[field]) &&
              !shallowEqualObjects(newValue[field], this.registry[field].internalModelProxy[field])
            ) {
              this.setFieldValue(field, newValue[field])
              this.registry[field].context.model = newValue[field]
            }
          }
        }
      },
      deep: true
    },
    formErrors (errors) {
      this.errorObservers.forEach(observer => observer(errors))
    }
  },
  created () {
    this.$formulate.register(this)
    this.applyInitialValues()
  },
  destroyed () {
    this.$formulate.deregister(this)
  },
  methods: {
    applyInitialValues () {
      if (this.hasInitialValue) {
        this.internalFormModelProxy = this.initialValues
      }
    },
    applyErrors ({ formErrors, fieldErrors }) {
      // given an object of errors, apply them to this form
      this.formErrors = formErrors
      this.fieldErrors = fieldErrors
    },
    addErrorObserver (observer) {
      if (!this.errorObservers.find(obs => observer === obs)) {
        this.errorObservers.push(observer)
      }
    },
    removeErrorObserver (observer) {
      console.log('remove error observer')
      this.errorObservers = this.errorObservers.filter(fn => fn !== observer)
    },
    setFieldValue (field, value) {
      Object.assign(this.internalFormModelProxy, { [field]: value })
      this.$emit('input', Object.assign({}, this.internalFormModelProxy))
    },
    getUniqueRegistryName (base, count = 0) {
      if (Object.prototype.hasOwnProperty.call(this.registry, base + (count || ''))) {
        return this.getUniqueRegistryName(base, count + 1)
      }
      return base + (count || '')
    },
    register (field, component) {
      // Don't re-register fields... @todo come up with another way of handling this that doesn't break multi option
      if (Object.prototype.hasOwnProperty.call(this.registry, field)) {
        return false
      }
      this.registry[field] = component
      const hasVModelValue = Object.prototype.hasOwnProperty.call(component.$options.propsData, 'formulateValue')
      const hasValue = Object.prototype.hasOwnProperty.call(component.$options.propsData, 'value')
      if (
        !hasVModelValue &&
        this.hasInitialValue &&
        this.initialValues[field]
      ) {
        // In the case that the form is carrying an initial value and the
        // element is not, set it directly.
        component.context.model = this.initialValues[field]
      } else if (
        (hasVModelValue || hasValue) &&
        !shallowEqualObjects(component.internalModelProxy, this.initialValues[field])
      ) {
        this.setFieldValue(field, component.internalModelProxy)
      }
    },
    registerErrorComponent (component) {
      if (!this.errorComponents.includes(component)) {
        this.errorComponents.push(component)
      }
    },
    formSubmitted () {
      // perform validation here
      this.showErrors()
      const submission = new FormSubmission(this)
      this.$emit('submit-raw', submission)
      return submission.hasValidationErrors()
        .then(hasErrors => hasErrors ? undefined : submission.values())
        .then(data => {
          if (typeof data !== 'undefined') {
            this.$emit('submit', data)
            return data
          }
          return undefined
        })
    },
    showErrors () {
      for (const fieldName in this.registry) {
        this.registry[fieldName].formShouldShowErrors = true
      }
    },
    getFormValues () {
      return this.internalFormModelProxy
    },
    hasValidationErrors () {
      const resolvers = []
      for (const fieldName in this.registry) {
        if (typeof this.registry[fieldName].hasValidationErrors === 'function') {
          resolvers.push(this.registry[fieldName].hasValidationErrors())
        }
      }
      return Promise.all(resolvers).then(fields => !!fields.find(hasErrors => hasErrors))
    }
  }
}
</script>
