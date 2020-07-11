<template>
  <div
    :class="context.classes.element"
    :data-type="context.type"
  >
    <input
      v-model="context.model"
      :type="type"
      v-bind="attributes"
      v-on="$listeners"
      @blur="context.blurHandler"
    >
    <div
      v-if="context.showValue"
      :class="context.classes.rangeValue"
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
