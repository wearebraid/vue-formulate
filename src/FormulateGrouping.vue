<template>
  <FormulateSlot
    name="grouping"
    :context="context"
  >
    <FormulateRepeatableProvider
      v-for="(item, index) in items"
      :key="index"
      :index="index"
      :set-field-value="setFieldValue"
      :context="context"
    >
      <slot />
    </FormulateRepeatableProvider>
    <FormulateSlot
      v-if="canAddMore"
      name="addmore"
    >
      <component
        :is="context.slotComponents.addMore"
        @add="addItem"
      />
    </FormulateSlot>
  </FormulateSlot>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  provide () {
    return {
      formulateFormSetter: this.setFieldValue,
      formulateFormRegister: this.register
    }
  },
  computed: {
    canAddMore () {
      return (this.context.repeatable && this.items.length < this.context.limit)
    },
    items () {
      return Array.isArray(this.context.model) ? this.context.model : [{}]
    }
  },
  methods: {
    addItem () {
      if (Array.isArray(this.context.model)) {
        this.context.model.push({})
        return
      }
      this.context.model = this.items.concat([{}])
    },
    setFieldValue (index, field, value) {
      const values = Array.isArray(this.context.model) ? this.context.model : []
      values.splice(index, 1, Object.assign(
        {},
        typeof this.context.model[index] === 'object' ? this.context.model[index] : {},
        { [field]: value }
      ))
      this.context.model = values
    },
    register () {

    }
  }
}
</script>
