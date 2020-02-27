<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <input
      v-model="context.model"
      :type="type"
      v-bind="attributes"
      @blur="context.blurHandler"
    >
    <div
      v-if="context.showValue"
      class="formulate-input-element-range-value"
      v-text="context.model"
    />
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputSlider',
  mixins: [FormulateInputMixin]
}
</script>
