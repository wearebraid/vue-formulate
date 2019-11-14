<template>
  <div
    class="formulate-input-element formulate-input-element--textarea"
    data-type="textarea"
  >
    <textarea
      v-model="context.model"
      v-bind="attributes"
      @blur="context.blurHandler"
    />
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputTextArea',
  mixins: [FormulateInputMixin]
}
</script>
