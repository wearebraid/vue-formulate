<template>
  <form
    @submit.prevent="submit"
    class="formulate-form"
  >
    <slot />
  </form>
</template>

<script>
import {equals} from '../utils'
import cloneDeep from 'clone-deep'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    module: {
      type: [String, Boolean],
      default: function () {
        return this.$formulate.options.vuexModule
      }
    },
    initial: {
      type: Object,
      default: () => ({})
    },
    behavior: {
      type: String,
      default: 'blur'
    },
    showErrors: {
      type: [Boolean, Object],
      default: () => ({})
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    prevent: {
      type: String,
      default: 'validation'
    }
  },
  data () {
    return {
      parentIdentifier: 'vue-formulate-wrapper-element',
      forceErrors: null,
      fieldInitials: {}
    }
  },
  computed: {
    m () {
      return `${this.module ? this.module + '/' : ''}`
    },
    hasErrors () {
      return this.$store.getters[`${this.m}hasErrors`][this.name] || false
    },
    hasValidationErrors () {
      return this.$store.getters[`${this.m}hasValidationErrors`][this.name] || false
    },
    values () {
      return cloneDeep(this.$store.getters[`${this.m}formValues`][this.name] || {})
    },
    storeErrors () {
      return this.$store.getters[`${this.m}formErrors`][this.name] || {}
    },
    validationErrors () {
      return this.$store.getters[`${this.m}formValidationErrors`][this.name] || {}
    },
    fields () {
      return this.$store.getters[`${this.m}formMeta`][this.name] || []
    },
    shouldShowErrors () {
      if (this.forceErrors === false || this.forceErrors === true) {
        return this.forceErrors
      }
      if (this.showErrors === false || this.showErrors === true) {
        return this.showErrors
      }
      return this.behavior === 'live'
    },
    mergedInitial () {
      return Object.assign({}, Object.assign({}, this.initial), this.fieldInitials)
    }
  },
  watch: {
    mergedInitial () {
      this.hydrate(this.mergedInitial)
    }
  },
  created () {
    this.hydrate(this.mergedInitial)
  },
  mounted () {
    this.hydrate(this.mergedInitial)
  },
  methods: {
    registerField (field, data) {
      this.$store.commit(`${this.m}setFieldMeta`, {form: this.name, field, data})
      this.updateFormValidation()
    },
    hydrate (values) {
      for (let field of this.fields) {
        if (field.type !== 'submit') {
          this.$store.commit(`${this.m}setFieldValue`, {
            field: field.name,
            value: values[field.name],
            form: this.name
          })
        }
      }
      this.updateFormValidation()
    },
    setInitial (field, value) {
      this.fieldInitials[field] = value
    },
    update (change) {
      this.$store.commit(`${this.m}setFieldValue`, Object.assign(change, {
        form: this.name
      }))
      this.updateFormValidation()
    },
    updateFieldErrors (change) {
      this.$store.commit(`${this.m}setFieldErrors`, Object.assign(change, {
        form: this.name
      }))
    },
    updateFieldValidationErrors (change) {
      this.$store.commit(`${this.m}setFieldValidationErrors`, Object.assign(change, {
        form: this.name
      }))
    },
    async validateField ({field, validation, label}) {
      let errors = await this.$formulate.validationErrors({
        field,
        value: this.values[field],
        label
      }, validation, this.values)
      if (!equals(errors || [], (this.validationErrors[field] || []))) {
        this.updateFieldValidationErrors({field, errors: errors || []})
      }
      return errors
    },
    updateFormValidation () {
      this.fields.map(async field => this.validateField({
        field: field.name,
        validation: field.validation,
        label: field.validationLabel || field.label || field.name
      }))
    },
    submit () {
      if ((this.prevent === 'validation' && this.hasValidationErrors) || (this.prevent === 'any' && this.hasErrors)) {
        this.forceErrors = true
      } else {
        this.$emit('submit', Object.assign({}, this.values))
      }
    }
  }
}
</script>
