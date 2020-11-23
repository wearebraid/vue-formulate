<template>
  <form
    :class="classes.form"
    v-bind="attributes"
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
    <slot v-bind="{ isLoading }" />
  </form>
</template>

<script>
import { arrayify, has, camel, extractAttributes } from './libs/utils'
import { classProps } from './libs/classes'
import useRegistry, { useRegistryComputed, useRegistryMethods, useRegistryProviders } from './libs/registry'
import FormSubmission from './FormSubmission'

export default {
  name: 'FormulateForm',
  inheritAttrs: false,
  provide () {
    return {
      ...useRegistryProviders(this),
      observeErrors: this.addErrorObserver,
      removeErrorObserver: this.removeErrorObserver,
      formulateFieldValidation: this.formulateFieldValidation
    }
  },
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
    },
    keepModelData: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ...useRegistry(this),
      formShouldShowErrors: false,
      errorObservers: [],
      namedErrors: [],
      namedFieldErrors: {},
      isLoading: false
    }
  },
  computed: {
    ...useRegistryComputed(),
    pseudoProps () {
      return extractAttributes(this.$attrs, classProps.filter(p => /^form/.test(p)))
    },
    attributes () {
      return Object.keys(this.$attrs)
        .filter(attr => !has(this.pseudoProps, camel(attr)))
        .reduce((fields, field) => ({ ...fields, [field]: this.$attrs[field] }), {}) // Create an object of attributes to re-bind
    },
    formContext () {
      return {
        errors: this.mergedFormErrors,
        pseudoProps: this.pseudoProps
      }
    },
    classes () {
      return this.$formulate.classes({
        ...this.$props,
        ...this.pseudoProps,
        ...this.formContext,
        type: 'form',
        classification: 'form',
        value: this.proxy,
        attrs: this.$attrs
      })
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
      if (this.isLoading) {
        return undefined
      }
      this.isLoading = true

      // perform validation here
      this.showErrors()
      const submission = new FormSubmission(this)

      // Wait for the submission handler
      const submitRawHandler = this.$listeners['submit-raw'] || this.$listeners.submitRaw
      const rawHandlerReturn = typeof submitRawHandler === 'function'
        ? submitRawHandler(submission)
        : Promise.resolve(submission)
      const willResolveRaw = rawHandlerReturn instanceof Promise
        ? rawHandlerReturn
        : Promise.resolve(rawHandlerReturn)
      return willResolveRaw
        .then(res => {
          const sub = (res instanceof FormSubmission ? res : submission)
          return sub.hasValidationErrors().then(hasErrors => [sub, hasErrors])
        })
        .then(([sub, hasErrors]) => {
          if (!hasErrors && typeof this.$listeners.submit === 'function') {
            return sub.values()
              .then(values => {
                // If the listener returns a promise, we want to wait for that
                // that promise to resolve, but when we do resolve, we only
                // want to resolve the submission values
                const handlerReturn = this.$listeners.submit(values)
                return (handlerReturn instanceof Promise ? handlerReturn : Promise.resolve())
                  .then(() => values)
              })
          }
          return false
        })
        .then(values => {
          this.isLoading = false
          return values
        })
    },
    formulateFieldValidation (errorObject) {
      this.$emit('validation', errorObject)
    }
  }
}
</script>
