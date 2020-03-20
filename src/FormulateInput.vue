<template>
  <div
    class="formulate-input"
    :data-classification="classification"
    :data-has-errors="hasErrors"
    :data-is-showing-errors="hasVisibleErrors"
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
    <FormulateErrors
      v-if="!disableErrors"
      :type="`input`"
      :errors="explicitErrors"
      :field-name="nameOrFallback"
      :validation-errors="validationErrors"
      :show-validation-errors="showValidationErrors"
    />
  </div>
</template>

<script>
import context from './libs/context'
import { shallowEqualObjects, parseRules, snakeToCamel } from './libs/utils'
import nanoid from 'nanoid/non-secure'

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
    },
    checked: {
      type: [String, Boolean],
      default: false
    },
    disableErrors: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultId: nanoid(9),
      localAttributes: {},
      internalModelProxy: this.getInitialValue(),
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
    },
    parsedValidationRules () {
      const parsedValidationRules = {}
      Object.keys(this.validationRules).forEach((key) => {
        parsedValidationRules[snakeToCamel(key)] = this.validationRules[key]
      })
      return parsedValidationRules
    },
    messages () {
      const messages = {}
      Object.keys(this.validationMessages).forEach((key) => {
        messages[snakeToCamel(key)] = this.validationMessages[key]
      })
      return messages
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
    this.applyInitialValue()
    if (this.formulateFormRegister && typeof this.formulateFormRegister === 'function') {
      this.formulateFormRegister(this.nameOrFallback, this)
    }
    this.updateLocalAttributes(this.$attrs)
    this.performValidation()
  },
  methods: {
    getInitialValue () {
      // Manually request classification, pre-computed props
      var classification = this.$formulate.classify(this.type)
      classification = (classification === 'box' && this.options) ? 'group' : classification
      if (classification === 'box' && this.checked) {
        return this.value || true
      } else if (Object.prototype.hasOwnProperty.call(this.$options.propsData, 'value') && classification !== 'box') {
        return this.value
      } else if (Object.prototype.hasOwnProperty.call(this.$options.propsData, 'formulateValue')) {
        return this.formulateValue
      }
      return ''
    },
    applyInitialValue () {
      // This should only be run immediately on created and ensures that the
      // proxy and the model are both the same before any additional registration.
      if (
        !shallowEqualObjects(this.context.model, this.internalModelProxy) &&
        // we dont' want to set the model if we are a sub-box of a multi-box field
        (Object.prototype.hasOwnProperty(this.$options.propsData, 'options') && this.classification === 'box')
      ) {
        this.context.model = this.internalModelProxy
      }
    },
    updateLocalAttributes (value) {
      if (!shallowEqualObjects(value, this.localAttributes)) {
        this.localAttributes = value
      }
    },
    performValidation () {
      const rules = parseRules(this.validation, this.$formulate.rules(this.parsedValidationRules))
      this.pendingValidation = Promise.all(
        rules.map(([rule, args, ruleName]) => {
          var res = rule({
            value: this.context.model,
            getFormValues: this.getFormValues.bind(this),
            name: this.context.name
          }, ...args)
          res = (res instanceof Promise) ? res : Promise.resolve(res)
          return res.then(res => res ? false : this.getMessage(ruleName, args))
        })
      )
        .then(result => result.filter(result => result))
        .then(errorMessages => { this.validationErrors = errorMessages })
      return this.pendingValidation
    },
    getMessage (ruleName, args) {
      return this.getMessageFunc(ruleName)({
        args,
        name: this.mergedValidationName,
        value: this.context.model,
        vm: this,
        formValues: this.getFormValues()
      })
    },
    getMessageFunc (ruleName) {
      ruleName = snakeToCamel(ruleName)
      if (this.messages && typeof this.messages[ruleName] !== 'undefined') {
        switch (typeof this.messages[ruleName]) {
          case 'function':
            return this.messages[ruleName]
          case 'string':
            return () => this.messages[ruleName]
        }
      }
      return (context) => this.$formulate.validationMessage(ruleName, context, this)
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
