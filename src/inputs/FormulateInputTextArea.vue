<template>
  <div
    :class="context.classes.element"
    data-type="textarea"
  >
    <FormulateSlot
      name="prefix"
      :context="context"
    />
    <textarea
      v-model="context.model"
      v-bind="attributes"
      v-on="$listeners"
      @blur="context.blurHandler"
    />
    <FormulateSlot
      name="suffix"
      :context="context"
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
