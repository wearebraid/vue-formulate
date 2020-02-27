<template>
  <div
    class="formulate-input"
    :data-classification="classification"
    :data-has-errors="hasErrors"
    :data-is-showing-errors="hasErrors && showFieldErrors"
    :data-type="type"
  >
    <div class="formulate-input-wrapper">
      <slot
        v-if="context.hasLabel && context.labelPosition === 'before'"
        name="label"
        v-bind="context"
      >
        <label
          class="formulate-input-label formulate-input-label--before"
          :for="context.attributes.id"
          v-text="context.label"
        />
      </slot>
      <slot
        name="element"
        v-bind="context"
      >
        <component
          :is="context.component"
          :context="context"
        >
          <slot v-bind="context" />
        </component>
      </slot>
      <slot
        v-if="context.hasLabel && context.labelPosition === 'after'"
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
    <FormulateInputErrors
      v-if="showFieldErrors"
      :errors="mergedErrors"
    />
  </div>
</template>

<script>
import context from './libs/context'
import { shallowEqualObjects, parseRules } from './libs/utils'
import nanoid from 'nanoid'

export default {
  name: 'FormulateInput',
  inheritAttrs: false,
  inject: {
    formulateFormSetter: { default: undefined },
    formulateFormRegister: { default: undefined },
    getFormValues: { default: () => () => ({}) }
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
      type: [String, Boolean],
      default: true
    },
    /* eslint-disable */
    formulateValue: {
      default: ''
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
    },
    errors: {
      type: [String, Array, Boolean],
      default: false
    },
    validation: {
      type: [String, Boolean, Array],
      default: false
    },
    validationName: {
      type: [String, Boolean],
      default: false
    },
    error: {
      type: [String, Boolean],
      default: false
    },
    errorBehavior: {
      type: String,
      default: 'blur',
      validator: function (value) {
        return ['blur', 'live'].includes(value)
      }
    },
    showErrors: {
      type: Boolean,
      default: false
    },
    imageBehavior: {
      type: String,
      default: 'preview'
    },
    uploadUrl: {
      type: [String, Boolean],
      default: false
    },
    uploader: {
      type: [Function, Object, Boolean],
      default: false
    },
    uploadBehavior: {
      type: String,
      default: 'live'
    },
    preventWindowDrops: {
      type: Boolean,
      default: true
    },
    showValue: {
      type: [String, Boolean],
      default: false
    },
    validationMessages: {
      type: Object,
      default: () => ({})
    },
    validationRules: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      /**
       * @todo consider swapping out nanoid for this._uid
       */
      defaultId: nanoid(9),
      localAttributes: {},
      internalModelProxy: this.formulateValue || this.value,
      behavioralErrorVisibility: (this.errorBehavior === 'live'),
      formShouldShowErrors: false,
      validationErrors: [],
      pendingValidation: Promise.resolve()
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
    },
    internalModelProxy (newValue, oldValue) {
      this.performValidation()
      if (!this.isVmodeled && !shallowEqualObjects(newValue, oldValue)) {
        this.context.model = newValue
      }
    },
    formulateValue (newValue, oldValue) {
      if (this.isVmodeled && !shallowEqualObjects(newValue, oldValue)) {
        this.context.model = newValue
      }
    }
  },
  created () {
    if (this.formulateFormRegister && typeof this.formulateFormRegister === 'function') {
      this.formulateFormRegister(this.nameOrFallback, this)
    }
    this.updateLocalAttributes(this.$attrs)
    this.performValidation()
  },
  methods: {
    updateLocalAttributes (value) {
      if (!shallowEqualObjects(value, this.localAttributes)) {
        this.localAttributes = value
      }
    },
    performValidation () {
      const rules = parseRules(this.validation, this.$formulate.rules(this.validationRules))
      this.pendingValidation = Promise.all(
        rules.map(([rule, args]) => {
          var res = rule({
            value: this.context.model,
            getFormValues: this.getFormValues.bind(this),
            name: this.context.name
          }, ...args)
          res = (res instanceof Promise) ? res : Promise.resolve(res)
          return res.then(res => res ? false : this.getValidationMessage(rule, args))
        })
      )
        .then(result => result.filter(result => result))
        .then(errorMessages => { this.validationErrors = errorMessages })
      return this.pendingValidation
    },
    getValidationMessage (rule, args) {
      return this.getValidationFunction(rule)({
        args,
        name: this.mergedValidationName,
        value: this.context.model,
        vm: this,
        formValues: this.getFormValues()
      })
    },
    getValidationFunction (rule) {
      const ruleName = rule.name.substr(0, 1) === '_' ? rule.name.substr(1) : rule.name
      if (this.validationMessages && typeof this.validationMessages === 'object' && typeof this.validationMessages[ruleName] !== 'undefined') {
        switch (typeof this.validationMessages[ruleName]) {
          case 'function':
            return this.validationMessages[ruleName]
          case 'string':
            return () => this.validationMessages[ruleName]
        }
      }
      return (context) => this.$formulate.validationMessage(rule.name, context)
    },
    hasValidationErrors () {
      return new Promise(resolve => {
        this.$nextTick(() => {
          this.pendingValidation.then(() => resolve(!!this.validationErrors.length))
        })
      })
    }
  }
}
</script>
