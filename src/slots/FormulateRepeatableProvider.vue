<template>
  <FormulateSlot
    name="repeatable"
  >
    <FormulateRepeatable>
      <slot />
    </FormulateRepeatable>
  </FormulateSlot>
</template>

<script>
import useRegistry, { useRegistryComputed, useRegistryMethods, useRegistryProviders } from '../libs/registry'

export default {
  provide () {
    return {
      ...useRegistryProviders(this),
      formulateSetter: (field, value) => this.setFieldValue(this.index, field, value)
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
    ...useRegistryMethods(['setFieldValue'])
  }
}
</script>
