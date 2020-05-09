<template>
  <FormulateSlot
    name="grouping"
    class="formulate-input-grouping"
    :context="context"
    :force-wrap="context.repeatable"
  >
    <FormulateRepeatableProvider
      v-for="(item, index) in items"
      :ref="`provider-${index}`"
      :key="index"
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
      isSubField: () => true
    }
  },
  inject: ['formulateRegisterRule', 'formulateRemoveRule'],
  computed: {
    items () {
      return Array.isArray(this.context.model) ? this.context.model : [{}]
    },
    providers () {
      return this.items.map((item, i) => Array.isArray(this.$refs[`provider-${i}`]) ? this.$refs[`provider-${i}`][0] : false)
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
    setFieldValue (index, field, value) {
      const values = Array.isArray(this.context.model) ? this.context.model : []
      values.splice(index, 1, Object.assign(
        {},
        typeof this.context.model[index] === 'object' ? this.context.model[index] : {},
        { [field]: value }
      ))
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
      this.providers.map(p => p && typeof p.showErrors === 'function' && p.showErrors())
    },
    removeItem (index) {
      if (Array.isArray(this.context.model)) {
        this.context.model.splice(index, 1)
      }
    }
  }
}
</script>
