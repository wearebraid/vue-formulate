<template>
  <ul class="custom-input pill">
    <li
      v-for="(option, val) in options"
      :key="val"
      v-text="option"
      :data-selected="val === value"
      @click="$emit('input', val)"
    />
  </ul>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: false
    }
  }
}
</script>

<style>
.pill {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  justify-content: space-between;
}

.pill li {
  flex-grow: 1;
  padding: .75em 1em;
  text-align: center;
  border: 1px solid #41b883;
  cursor: pointer;
}

.pill li:hover {
  background-color: rgba(65, 184, 131, .15);
}

.pill li[data-selected] {
  color: white;
  background-color: #41b883;
}

.pill li:first-child {
  border-radius: .5em 0 0 .5em;
  border-right: 0;
}

.pill li:last-child {
  border-radius: 0 .5em .5em 0;
  border-left: 0;
}
</style>
