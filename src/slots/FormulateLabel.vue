<template>
  <label
    :class="`formulate-input-label formulate-input-label--${context.labelPosition}`"
    :for="context.id"
    v-text="context.label"
  />
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
