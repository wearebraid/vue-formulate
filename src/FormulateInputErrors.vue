<template>
  <ul
    v-if="errors.length"
    class="formulate-input-errors"
  >
    <!-- eslint-disable -->
    <li
      v-for="error in errors"
      :key="error"
      v-html="error"
      class="formulate-input-error"
    />
    <!-- eslint-enable -->
  </ul>
</template>

<script>
export default {
  props: {
    errors: {
      type: [Boolean, Array],
      required: true
    }
  }
}
</script>
