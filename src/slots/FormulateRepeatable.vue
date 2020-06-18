<template>
  <div
    :class="context.classes.groupRepeatable"
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
        v-bind="context.slotProps.remove"
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
