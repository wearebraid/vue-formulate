<template>
  <FormulateSlot
    name="grouping"
    :class="context.classes.grouping"
    :context="context"
    :force-wrap="context.repeatable"
  >
    <FormulateRepeatableProvider
      v-for="(item, index) in items"
      :key="item.__id"
      :index="index"
      :set-field-value="(field, value) => setFieldValue(index, field, value)"
      :context="context"
      @remove="removeItem"
    >
      <slot />
    </FormulateRepeatableProvider>
  </FormulateSlot>
</template>

<script>
import { setId } from './libs/utils'

export default {
  name: 'FormulateGrouping',
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  provide () {
    return {
      isSubField: () => true,
      registerProvider: this.registerProvider,
      deregisterProvider: this.deregisterProvider
    }
  },
  data () {
    return {
      providers: []
    }
  },
  inject: ['formulateRegisterRule', 'formulateRemoveRule'],
  computed: {
    items () {
      if (Array.isArray(this.context.model)) {
        if (!this.context.repeatable && this.context.model.length === 0) {
          return [setId({})]
        }
        return this.context.model.map(item => setId(item, item.__id))
      }
      return (new Array(this.context.minimum || 1)).fill('').map(() => setId({}))
    },
    formShouldShowErrors () {
      return this.context.formShouldShowErrors
    }
  },
  watch: {
    providers () {
      if (this.formShouldShowErrors) {
        this.showErrors()
      }
    },
    formShouldShowErrors (val) {
      if (val) {
        this.showErrors()
      }
    }
  },
  created () {
    // We register with an error message of 'true' which causes the validation to fail but no message output.
    this.formulateRegisterRule(this.validateGroup.bind(this), [], 'formulateGrouping', true)
  },
  destroyed () {
    this.formulateRemoveRule('formulateGrouping')
  },
  methods: {
    getAtIndex (index) {
      if (typeof this.context.model[index] !== 'undefined' && this.context.model[index].__id) {
        return this.context.model[index]
      } else if (typeof this.context.model[index] !== 'undefined') {
        return setId(this.context.model[index])
      } else if (typeof this.context.model[index] === 'undefined' && typeof this.items[index] !== 'undefined') {
        return setId({}, this.items[index].__id)
      }
      return setId({})
    },
    setFieldValue (index, field, value) {
      const values = Array.isArray(this.context.model) ? this.context.model : []
      const previous = this.getAtIndex(index)
      const updated = setId(Object.assign({}, previous, { [field]: value }), previous.__id)
      values.splice(index, 1, updated)
      this.context.model = values
    },
    validateGroup () {
      return Promise.all(this.providers.reduce((resolvers, provider) => {
        if (provider && typeof provider.hasValidationErrors === 'function') {
          resolvers.push(provider.hasValidationErrors())
        }
        return resolvers
      }, [])).then(providersHasErrors => !providersHasErrors.some(hasErrors => !!hasErrors))
    },
    showErrors () {
      this.providers.forEach(p => p && typeof p.showErrors === 'function' && p.showErrors())
    },
    removeItem (index) {
      if (Array.isArray(this.context.model) && this.context.model.length > this.context.minimum) {
        // In this context we actually have data
        this.context.model.splice(index, 1)
      } else if (this.items.length > this.context.minimum) {
        // In this context the fields have never been touched (not "dirty")
        this.context.model = (new Array(this.items.length - 1)).fill('').map(() => setId({}))
      }
      // Otherwise, do nothing, we're at our minimum
    },
    registerProvider (provider) {
      if (!this.providers.some(p => p === provider)) {
        this.providers.push(provider)
      }
    },
    deregisterProvider (provider) {
      this.providers = this.providers.filter(p => p !== provider)
    }
  }
}
</script>
