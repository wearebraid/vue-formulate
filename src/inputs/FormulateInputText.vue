<template>
  <div
    :class="context.classes.element"
    :data-type="context.type"
  >
    <input
      v-model="context.model"
      :type="type"
      v-bind="attributes"
      @blur="context.blurHandler"
      v-on="$listeners"
    >
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputText',
  mixins: [FormulateInputMixin]
}
</script>
