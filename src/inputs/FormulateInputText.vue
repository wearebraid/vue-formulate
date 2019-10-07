<template>
  <div
    class="formulate-input-element formulate-input-element--textarea"
  >
    <input
      v-model="context.model"
      :type="type"
      v-bind="attributes"
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
