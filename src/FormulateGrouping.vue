<template>
  <FormulateSlot
    name="repeatable"
  >
    <FormulateRepeatable
      v-for="item in items"
      :key="item.id"
    >
      <slot />
    </FormulateRepeatable>
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
    items () {
      return [{ id: 1 }, { id: 2 }]
    }
  }
}
</script>

<style>

</style>
