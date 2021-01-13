<template>
  <div
    :class="context.classes.element"
    :data-type="context.type"
  >
    <FormulateSlot
      name="prefix"
      :context="context"
    />
    <button
      :type="type"
      v-bind="attributes"
      v-on="$listeners"
    >
      <slot :context="context">
        <component
          :is="context.slotComponents.buttonContent"
          :context="context"
        />
      </slot>
    </button>
    <FormulateSlot
      name="suffix"
      :context="context"
    />
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputButton',
  mixins: [FormulateInputMixin]
}
</script>
