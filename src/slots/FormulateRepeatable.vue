<template>
  <div
    class="formulate-input-group-repeatable"
  >
    <FormulateSlot
      name="remove"
      :context="context"
      :remove-item="removeItem"
    >
      <component
        :is="context.slotComponents.remove"
        :context="context"
        :remove-item="removeItem"
      />
    </FormulateSlot>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true
    },
    removeItem: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  }
}
</script>
