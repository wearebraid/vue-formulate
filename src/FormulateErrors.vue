<template>
  <ul
    v-if="visibleErrors.length"
    :class="`formulate-${type}-errors`"
  >
    <li
      v-for="error in visibleErrors"
      :key="error"
      :class="`formulate-${type}-error`"
      v-text="error"
    />
  </ul>
</template>

<script>
import { arrayify } from './libs/utils'

export default {
  inject: {
    observeErrors: {
      default: false
    },
    removeErrorObserver: {
      default: false
    }
  },
  props: {
    showValidationErrors: {
      type: Boolean,
      default: false
    },
    errors: {
      type: [Array, Boolean],
      default: false
    },
    validationErrors: {
      type: [Array],
      default: () => ([])
    },
    type: {
      type: String,
      default: 'form'
    },
    preventRegistration: {
      type: Boolean,
      default: false
    },
    fieldName: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      boundSetErrors: this.setErrors.bind(this),
      localErrors: []
    }
  },
  computed: {
    mergedErrors () {
      return arrayify(this.errors).concat(this.localErrors)
    },
    visibleErrors () {
      return Array.from(new Set(this.mergedErrors.concat(this.showValidationErrors ? this.validationErrors : [])))
    }
  },
  created () {
    if (!this.preventRegistration && typeof this.observeErrors === 'function' && (this.type === 'form' || this.fieldName)) {
      this.observeErrors({ callback: this.boundSetErrors, type: this.type, field: this.fieldName })
    }
  },
  destroyed () {
    if (!this.preventRegistration && typeof this.removeErrorObserver === 'function') {
      this.removeErrorObserver(this.boundSetErrors)
    }
  },
  methods: {
    setErrors (errors) {
      this.localErrors = arrayify(errors)
    }
  }
}
</script>
