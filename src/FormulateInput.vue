<template>
  <div
    class="formulate-input"
    :data-classification="classification"
    :data-type="type"
  >
    <div class="formulate-input-wrapper">
      <slot
        v-if="context.label && context.labelPosition === 'before'"
        name="label"
        v-bind="context"
      >
        <label
          class="formulate-input-label formulate-input-label--before"
          :for="id"
          v-text="context.label"
        />
      </slot>
      <slot v-bind="context">
        <component
          :is="context.component"
          :context="context"
        />
      </slot>
      <slot
        v-if="context.label && context.labelPosition === 'after'"
        name="label"
        v-bind="context.label"
      >
        <label
          class="formulate-input-label formulate-input-label--after"
          :for="id"
          v-text="context.label"
        />
      </slot>
    </div>
    <div
      v-if="help"
      class="formulate-input-help"
      v-text="help"
    />
  </div>
</template>

<script>
import context from './libs/context'
import nanoid from 'nanoid'

export default {
  name: 'FormulateInput',
  inheritAttrs: false,
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    formulateValue: {
      type: [String, Number, Object, Boolean, Array],
      default: false
    },
    value: {
      type: [String, Number, Object, Boolean, Array],
      default: false
    },
    options: {
      type: [Object, Array, Boolean],
      default: false
    },
    optionGroups: {
      type: [Object, Boolean],
      default: false
    },
    id: {
      type: [String, Boolean, Number],
      default: () => nanoid(9)
    },
    label: {
      type: [String, Boolean],
      default: false
    },
    labelPosition: {
      type: [String, Boolean],
      default: false
    },
    help: {
      type: [String, Boolean],
      default: false
    }
  },
  computed: {
    context,
    classification () {
      const classification = this.$formulate.classify(this.type)
      return (classification === 'box' && this.options) ? 'group' : classification
    },
    component () {
      return this.$formulate.component(this.type)
    }
  }
}
</script>
