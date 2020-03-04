<template>
  <ul
    v-if="mergedErrors.length"
    :class="`formulate-${type}-errors`"
  >
    <!-- eslint-disable -->
    <li
      v-for="error in mergedErrors"
      :key="error"
      v-html="error"
      :class="`formulate-${type}-error`"
    />
    <!-- eslint-enable -->
  </ul>
</template>

<script>
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
    errors: {
      type: [Boolean, Array],
      default: false
    },
    type: {
      type: String,
      default: 'form'
    },
    preventRegistration: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      boundSetErrors: this.setErrors.bind(this),
      formErrors: []
    }
  },
  computed: {
    mergedErrors () {
      return (this.errors || []).concat(this.formErrors)
    }
  },
  created () {
    if (!this.preventRegistration && typeof this.observeErrors === 'function') {
      this.observeErrors(this.boundSetErrors)
    }
  },
  destroyed () {
    if (!this.preventRegistration && typeof this.removeErrorObserver === 'function') {
      this.removeErrorObserver(this.boundSetErrors)
    }
  },
  methods: {
    setErrors (errors) {
      this.formErrors = errors
    }
  }
}
</script>
