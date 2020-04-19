<template>
  <FormulateSlot
    name="repeatable"
  >
    <FormulateRepeatable>
      <slot />
    </FormulateRepeatable>
  </FormulateSlot>
</template>

<script>
export default {
  provide () {
    return {
      formulateFormSetter: (field, value) => this.setFieldValue(this.index, field, value)
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    context: {
      type: Object,
      required: true
    },
    setFieldValue: {
      type: Function,
      required: true
    }
  }
}
</script>
