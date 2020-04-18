<template>
  <FormulateSlot
    name="grouping"
    :context="context"
  >
    <component
      :is="context.slotComponents.repeatable"
      v-for="(item, index) in items"
      :key="index"
    >
      <slot />
    </component>
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
  computed: {
    canAddMore () {
      return (this.context.repeatable && this.items.length < this.context.limit)
    },
    items () {
      return Array.isArray(this.context.model) ? this.context.model : []
    }
  },
  methods: {
    addItem () {
      const item = { id: this.items.length }
      if (Array.isArray(this.context.model)) {
        this.context.model.push(item)
        return
      }
      this.context.model = [item]
    }
  }
}
</script>
