<template>
  <div
    class="formulate-input-group-repeatable"
  >
    <a
      v-if="context.repeatable"
      class="formulate-input-group-repeatable-remove"
      role="button"
      @click.prevent="removeItem"
      @keypress.enter="removeItem"
    />
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
