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
      v-bind="context.slotProps.repeatable"
    >
      <FormulateSlot
        :context="context"
        :index="index"
        name="default"
      />
    </component>
  </FormulateSlot>
</template>

<script>
import useRegistry, { useRegistryComputed, useRegistryMethods, useRegistryProviders } from './libs/registry'

export default {
  provide () {
    return {
      ...useRegistryProviders(this, ['getFormValues']),
      formulateSetter: (field, value) => this.setFieldValue(field, value)
    }
  },
  inject: {
    registerProvider: 'registerProvider',
    deregisterProvider: 'deregisterProvider'
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
  created () {
    this.registerProvider(this)
  },
  beforeDestroy () {
    this.deregisterProvider(this)
  },
  methods: {
    ...useRegistryMethods(['setFieldValue']),
    removeItem () {
      this.$emit('remove', this.index)
    }
  }
}
</script>
