<template>
  <ul
    v-if="visibleErrors.length"
    :class="outerClass"
  >
    <li
      v-for="error in visibleErrors"
      :key="error"
      :class="itemClass"
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
    context: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'form'
    }
  },
  data () {
    return {
      boundSetErrors: this.setErrors.bind(this),
      localErrors: []
    }
  },
  computed: {
    visibleValidationErrors () {
      return Array.isArray(this.context.visibleValidationErrors) ? this.context.visibleValidationErrors : []
    },
    errors () {
      return Array.isArray(this.context.errors) ? this.context.errors : []
    },
    mergedErrors () {
      return this.errors.concat(this.localErrors)
    },
    visibleErrors () {
      return Array.from(new Set(this.mergedErrors.concat(this.visibleValidationErrors)))
        .filter(message => typeof message === 'string')
    },
    outerClass () {
      if (this.type === 'input' && this.context.classes) {
        return this.context.classes.errors
      }
      return `formulate-${this.type}-errors`
    },
    itemClass () {
      if (this.type === 'input' && this.context.classes) {
        return this.context.classes.error
      }
      return `formulate-${this.type}-error`
    }
  },
  created () {
    // This registration is for <FormulateErrors /> that are used for displaying
    // Form errors in an override position.
    if (this.type === 'form' && typeof this.observeErrors === 'function' && !Array.isArray(this.context.errors)) {
      this.observeErrors({ callback: this.boundSetErrors, type: this.type })
    }
  },
  destroyed () {
    if (this.type === 'form' && typeof this.removeErrorObserver === 'function' && !Array.isArray(this.context.errors)) {
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
