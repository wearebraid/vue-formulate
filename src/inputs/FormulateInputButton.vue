<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <button
      :type="type"
      v-bind="attributes"
    >
      <slot>
        <span
          :class="`formulate-input-element--${context.type}--label`"
          v-text="context.value || context.label || context.name || 'Submit'"
        />
      </slot>
    </button>
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputButton',
  mixins: [FormulateInputMixin]
}
</script>
