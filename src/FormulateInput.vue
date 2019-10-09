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
          :for="context.attributes.id"
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
          :for="context.attributes.id"
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
import { shallowEqualObjects } from './libs/utils'
import nanoid from 'nanoid'

export default {
  name: 'FormulateInput',
  inheritAttrs: false,
  inject: {
    formulateFormSetter: { default: undefined },
    formulateFormRegister: { default: undefined }
  },
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: [Boolean, String],
      default: true
    },
    /* eslint-disable */
    formulateValue: {
      default: undefined
    },
    value: {
      default: false
    },
    /* eslint-enable */
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
      default: false
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
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultId: nanoid(9),
      localAttributes: {}
    }
  },
  computed: {
    ...context,
    classification () {
      const classification = this.$formulate.classify(this.type)
      return (classification === 'box' && this.options) ? 'group' : classification
    },
    component () {
      return (this.classification === 'group') ? 'FormulateInputGroup' : this.$formulate.component(this.type)
    }
  },
  watch: {
    '$attrs': {
      handler (value) {
        this.updateLocalAttributes(value)
      },
      deep: true
    }
  },
  created () {
    if (this.formulateFormRegister && typeof this.formulateFormRegister === 'function') {
      this.formulateFormRegister(this.name, this)
    }
    this.updateLocalAttributes(this.$attrs)
  },
  mounted () {
    if (this.debug) {
      console.log('MOUNTED:' + this.$options.name + ':' + this.type)
    }
  },
  methods: {
    updateLocalAttributes (value) {
      if (!shallowEqualObjects(value, this.localAttributes)) {
        this.localAttributes = value
      }
    }
  }
}
</script>
