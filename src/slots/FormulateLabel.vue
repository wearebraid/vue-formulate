<template>
  <label
    :class="context.classes.label"
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
