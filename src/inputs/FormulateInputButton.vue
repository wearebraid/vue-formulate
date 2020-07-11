<template>
  <div
    :class="context.classes.element"
    :data-type="context.type"
  >
    <button
      :type="type"
      v-bind="attributes"
      v-on="$listeners"
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
