<template>
  <form
    :class="classes"
    @submit.prevent="formSubmitted"
  >
    <FormulateSchema
      v-if="schema"
      :schema="schema"
    />
    <FormulateErrors
      v-if="!hasFormErrorObservers"
      :context="formContext"
    />
    <slot />
  </form>
</template>

<script>
import { arrayify, has } from './libs/utils'
import useRegistry, { useRegistryComputed, useRegistryMethods, useRegistryProviders } from './libs/registry'
import FormSubmission from './FormSubmission'

export default {
  provide () {
    return {
      ...useRegistryProviders(this),
      observeErrors: this.addErrorObserver,
      removeErrorObserver: this.removeErrorObserver,
      formulateFieldValidation: this.formulateFieldValidation
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
    },
    formErrors: {
      type: Array,
      default: () => ([])
    },
    schema: {
      type: [Array, Boolean],
      default: false
    }
  },
  data () {
    return {
      ...useRegistry(this),
      formShouldShowErrors: false,
      errorObservers: [],
      namedErrors: [],
      namedFieldErrors: {}
    }
  },
  computed: {
    ...useRegistryComputed(),
    formContext () {
      return {
        errors: this.mergedFormErrors
      }
    },
    classes () {
      const classes = { 'formulate-form': true }
      if (this.name) {
        classes[`formulate-form--${this.name}`] = true
      }
      return classes
    },
    mergedFormErrors () {
      return this.formErrors.concat(this.namedErrors)
    },
    mergedFieldErrors () {
      const errors = {}
      if (this.errors) {
        for (const fieldName in this.errors) {
          errors[fieldName] = arrayify(this.errors[fieldName])
        }
      }
      for (const fieldName in this.namedFieldErrors) {
        errors[fieldName] = arrayify(this.namedFieldErrors[fieldName])
      }
      return errors
    },
    hasFormErrorObservers () {
      return !!this.errorObservers.filter(o => o.type === 'form').length
    }
  },
  watch: {
    formulateValue: {
      handler (values) {
        if (this.isVmodeled &&
          values &&
          typeof values === 'object'
        ) {
          this.setValues(values)
        }
      },
      deep: true
    },
    mergedFormErrors (errors) {
      this.errorObservers
        .filter(o => o.type === 'form')
        .forEach(o => o.callback(errors))
    },
    mergedFieldErrors: {
      handler (errors) {
        this.errorObservers
          .filter(o => o.type === 'input')
          .forEach(o => o.callback(errors[o.field] || []))
      },
      immediate: true
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
    ...useRegistryMethods(),
    applyErrors ({ formErrors, inputErrors }) {
      // given an object of errors, apply them to this form
      this.namedErrors = formErrors
      this.namedFieldErrors = inputErrors
    },
    addErrorObserver (observer) {
      if (!this.errorObservers.find(obs => observer.callback === obs.callback)) {
        this.errorObservers.push(observer)
        if (observer.type === 'form') {
          observer.callback(this.mergedFormErrors)
        } else if (has(this.mergedFieldErrors, observer.field)) {
          observer.callback(this.mergedFieldErrors[observer.field])
        }
      }
    },
    removeErrorObserver (observer) {
      this.errorObservers = this.errorObservers.filter(obs => obs.callback !== observer)
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
    formulateFieldValidation (errorObject) {
      this.$emit('validation', errorObject)
    }
  }
}
</script>
