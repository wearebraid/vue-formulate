<template>
  <div
    class="formulate-input-element formulate-input-element--box"
    :data-type="context.type"
  >
    <input
      v-model="context.model"
      :type="type"
      :value="context.value"
      v-bind="attributes"
      @blur="context.blurHandler"
    >
    <label
      class="formulate-input-element-decorator"
      :for="id"
    />
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputBox',
  mixins: [FormulateInputMixin]
}
</script>
