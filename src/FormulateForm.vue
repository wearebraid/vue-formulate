<template>
  <form
    @submit.prevent="formSubmitted"
  >
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
      getFormValues: this.getFormValues
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
    }
  },
  data () {
    return {
      registry: {},
      internalFormModelProxy: {},
      formShouldShowErrors: false
    }
  },
  computed: {
    hasFormulateValue () {
      return this.formulateValue && typeof this.formulateValue === 'object'
    },
    isVmodeled () {
      return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
        this._events &&
        Array.isArray(this._events.input) &&
        this._events.input.length)
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
      deep: true,
      immediate: false
    }
  },
  created () {
    if (this.$options.propsData.hasOwnProperty('formulateValue')) {
      this.internalFormModelProxy = Object.assign({}, this.formulateValue)
    }
  },
  methods: {
    setFieldValue (field, value) {
      Object.assign(this.internalFormModelProxy, { [field]: value })
      this.$emit('input', Object.assign({}, this.internalFormModelProxy))
    },
    register (field, component) {
      this.registry[field] = component
      if (!component.$options.propsData.hasOwnProperty('formulateValue') && this.hasFormulateValue && this.formulateValue[field]) {
        // In the case that the form is carrying an initial value and the
        // element is not, set it directly.
        component.context.model = this.formulateValue[field]
      } else if (component.$options.propsData.hasOwnProperty('formulateValue') && !shallowEqualObjects(component.internalModelProxy, this.formulateValue[field])) {
        this.setFieldValue(field, component.internalModelProxy)
      }
    },
    formSubmitted () {
      // perform validation here
      this.showErrors()
      const submission = new FormSubmission(this)
      this.$emit('submit-raw', submission)
      submission.hasValidationErrors()
        .then(hasErrors => hasErrors ? false : submission.values())
        .then(json => this.$emit('submit', json))
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
