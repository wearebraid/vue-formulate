<template>
  <FormulateSlot
    name="repeatable"
    :context="context"
    :index="index"
    :remove-item="removeItem"
  >
    <component
      :is="context.slotComponents.repeatable"
      :context="context"
      :index="index"
      :remove-item="removeItem"
    >
      <slot />
    </component>
  </FormulateSlot>
</template>

<script>
import useRegistry, { useRegistryComputed, useRegistryMethods, useRegistryProviders } from './libs/registry'

export default {
  provide () {
    return {
      ...useRegistryProviders(this),
      formulateSetter: (field, value) => this.setFieldValue(field, value)
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    context: {
      type: Object,
      required: true
    },
    setFieldValue: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      ...useRegistry(this),
      isGrouping: true
    }
  },
  computed: {
    ...useRegistryComputed()
  },
  methods: {
    ...useRegistryMethods(['setFieldValue']),
    removeItem () {
      this.$emit('remove', this.index)
    }
  }
}
</script>
