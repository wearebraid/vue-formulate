<template>
  <div
    :class="context.classes.element"
    data-type="textarea"
  >
    <textarea
      v-model="context.model"
      v-bind="attributes"
      v-on="$listeners"
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
