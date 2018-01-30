<template>
  <form
    @submit.prevent="submit"
    class="formulate-element"
  >
    <slot />
  </form>
</template>

<script>
import {equals} from '../utils'

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
    }
  },
  data () {
    return {
      parentIdentifier: 'vue-formulate-wrapper-element'
    }
  },
  computed: {
    m () {
      return `${this.module ? this.module + '/' : ''}`
    },
    hasErrors () {
      return this.$store.getters[`${this.m}hasErrors`][this.name] || false
    },
    values () {
      return this.$store.getters[`${this.m}formValues`][this.name] || {}
    },
    errors () {
      return this.$store.getters[`${this.m}formErrors`][this.name] || {}
    },
    validationErrors () {
      return this.$store.getters[`${this.m}formValidationErrors`][this.name] || {}
    },
    fields () {
      return this.$formulate.fields(this.$vnode)
    }
  },
  created () {
    this.hydrate(this.initial)
  },
  methods: {
    hydrate (values) {
      for (let field of this.fields) {
        this.$store.commit(`${this.m}setFieldValue`, {
          field: field.name,
          value: values[field.name],
          form: this.name
        })
      }
      this.updateFormValidation()
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
    async validateField ({field, validation}) {
      let errors = await this.$formulate.validationErrors({
        field,
        value: this.values[field]
      }, validation, this.values)
      if (!equals(errors, (this.validationErrors[field] || []))) {
        this.updateFieldValidationErrors({field, errors})
      }
      return errors
    },
    updateFormValidation () {
      this.fields.map(async field => this.validateField({
        field: field.name,
        validation: field.validation
      }))
    },
    submit () {
      alert('submitting form')
    }
  }
}
</script>
