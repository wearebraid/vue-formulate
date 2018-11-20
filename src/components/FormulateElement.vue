<template>
  <div :class="classes">
    <div
      class="formulate-element-input-wrapper"
      :data-type="type"
      :data-classification="classification"
      :data-is-disabled="disabled"
    >
      <!-- TEXT STYLE INPUTS -->
      <label
        :for="id"
        v-text="label"
        v-if="label && (!isBoxInput || optionList.length > 1)"
      />
      <input
        ref="input"
        :class="elementClasses"
        :type="type"
        :name="name"
        v-model="val"
        v-bind="attributes"
        v-if="isTextInput"
        @blur="errorBlurState = true"
        :disabled="disabled"
        :step="step"
      >
      <textarea
        ref="textarea"
        :class="elementClasses"
        :type="type"
        :name="name"
        v-model="val"
        v-bind="attributes"
        v-if="isTextareaInput"
        @blur="errorBlurState = true"
        :disabled="disabled"
      />
      <!-- BUTTON INPUTS -->
      <button
        :type="type"
        :class="elementClasses"
        v-if="isButtonInput"
        :disabled="disabled || (type === 'submit' && (form.hasErrors && form.behavior === 'live'))"
      >
        <slot
          v-if="$slots.button"
          name="button"
        />
        <span
          v-text="label || name"
          v-else
        />
      </button>
      <!-- SELECT INPUTS -->
      <select
        v-bind="attributes"
        v-if="isSelectInput"
        :class="elementClasses"
        :name="name"
        v-model="val"
        @blur="errorBlurState = true"
        :disabled="disabled"
      >
        <option
          v-for="option in optionList"
          :value="option.value"
          :key="option.id"
          v-bind="option.attributes || {}"
          v-text="option.label"
        />
      </select>
      <!-- BOX INPUTS -->
      <div
        class="formulate-element-box-input-wrap"
        v-if="isBoxInput"
      >
        <div
          class="formulate-element-box-input-group"
          v-for="option in optionList"
          :key="option.id"
        >
          <input
            type="radio"
            :class="elementClasses"
            :name="name"
            :id="option.id"
            :value="option.value"
            :key="`${option.id}-input`"
            v-bind="attributes"
            v-model="val"
            v-if="type === 'radio'"
            @blur="errorBlurState = true"
            :disabled="disabled"
          >
          <input
            type="checkbox"
            :class="elementClasses"
            :name="name"
            :id="option.id"
            :value="option.value"
            :key="`${option.id}-input`"
            v-bind="attributes"
            v-model="val"
            v-if="type === 'checkbox'"
            @blur="errorBlurState = true"
            :disabled="disabled"
          >
          <label
            :for="option.id"
            :key="`${option.id}-label`"
            v-text="option.label"
          />
        </div>
      </div>
      <!-- CUSTOM SLOT INPUTS -->
      <slot v-if="hasCustomInput" />

      <!-- UNSUPORTED INPUT -->
      <div
        style="background-color: red; color: white"
        v-if="isUnsupportedInput"
        v-text="`Unsupported field type: “${type}”.`"
      />
    </div>
    <div
      class="formulate-help"
      v-if="help"
      v-text="help"
    />
    <transition
      name="formulate-errors"
    >
      <transition-group
        tag="ul"
        name="formulate-error-list"
        class="formulate-errors"
        v-if="shouldShowErrors && localAndValidationErrors.length"
      >
        <li
          v-for="error in localAndValidationErrors"
          v-text="error"
          :key="error"
        />
      </transition-group>
    </transition>
  </div>
</template>

<script>
import {inputTypes, equals, reduce, filter} from '../utils'
import shortid from 'shortid'

export default {
  props: {
    type: {
      type: [String, Boolean],
      default: 'text'
    },
    name: {
      type: String,
      required: true
    },
    initial: {
      type: [String, Number, Boolean],
      default: false
    },
    validation: {
      type: [String, Boolean],
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    label: {
      type: [String, Boolean],
      default: false
    },
    id: {
      type: [String],
      default: () => shortid.generate()
    },
    min: {
      type: [String, Number, Boolean],
      default: () => false
    },
    max: {
      type: [String, Number, Boolean],
      default: () => false
    },
    maxlength: {
      type: [String, Number, Boolean],
      default: () => false
    },
    pattern: {
      type: [String, Number, Boolean],
      default: () => false
    },
    minlength: {
      type: [String, Number, Boolean],
      default: () => false
    },
    placeholder: {
      type: [String, Number, Boolean],
      default: () => false
    },
    step: {
      type: [String, Number, Boolean],
      default: () => false
    },
    options: {
      type: [Object, Array],
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showErrors: {
      type: [Object, Boolean],
      default: () => ({})
    },
    validationLabel: {
      type: [String, Boolean],
      default: false
    },
    elementClasses: {
      type: [String, Array, Object],
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    help: {
      type: [Boolean, String],
      default: false
    }
  },
  data () {
    return {
      errorBlurState: false
    }
  },
  computed: {
    classification () {
      if (this.isTextInput) return 'text'
      if (this.isBoxInput) return 'box'
      if (this.isButtonInput) return 'button'
      if (this.isSelectInput) return 'select'
      if (this.hasCustomInput) return 'custom'
      return 'unsupported'
    },
    hasCustomInput () {
      return (this.$slots.default && this.$slots.default.length)
    },
    isTextInput () {
      return !this.hasCustomInput && inputTypes.text.includes(this.type)
    },
    isTextareaInput () {
      return !this.hasCustomInput && inputTypes.textarea.includes(this.type)
    },
    isButtonInput () {
      return !this.hasCustomInput && inputTypes.button.includes(this.type)
    },
    isSelectInput () {
      return !this.hasCustomInput && inputTypes.select.includes(this.type)
    },
    isBoxInput () {
      return !this.hasCustomInput && inputTypes.box.includes(this.type)
    },
    isUnsupportedInput () {
      return (!this.hasCustomInput && !this.isTextInput && !this.isButtonInput && !this.isSelectInput && !this.isBoxInput && !this.isTextareaInput)
    },
    form () {
      let parent = this.$parent
      while (parent && parent.$data && parent.$data.parentIdentifier !== 'vue-formulate-wrapper-element') {
        parent = parent.$parent
      }
      if (!parent.$data || parent.$data.parentIdentifier !== 'vue-formulate-wrapper-element') {
        throw new Error('FormulateElement has no FormulateWrapper element')
      }
      return parent
    },
    values () {
      return this.form.values
    },
    value () {
      let value = this.values[this.name]
      if (value === undefined) {
        switch (this.type) {
          case 'color':
            return '#000000'
          case 'checkbox':
            if (this.optionList.length > 1) {
              return []
            }
            break
        }
      }
      return value
    },
    module () {
      return this.form.$props['module']
    },
    formName () {
      return this.form.$props['name']
    },
    classes () {
      return {
        'formulate-element': true,
        [`formulate-element--type--${this.type}`]: true,
        'formulate-element--has-value': !!this.value,
        'formulate-element--has-errors': this.localAndValidationErrors.length && this.shouldShowErrors
      }
    },
    validationErrors () {
      return this.form.validationErrors[this.name] || []
    },
    storeErrors () {
      return this.form.storeErrors[this.name] || []
    },
    formErrors () {
      return this.form.errors[this.name] || []
    },
    localAndValidationErrors () {
      return this.errors.concat(this.validationErrors).concat(this.formErrors)
    },
    shouldShowErrors () {
      let show = this.form.shouldShowErrors
      if (this.form.behavior === 'blur') {
        show = show || this.errorBlurState
      }
      if (this.showErrors === false || this.showErrors === true) {
        show = this.showErrors
      }
      return show
    },
    attributes () {
      return ['min', 'max', 'minlength', 'maxlength', 'placeholder', 'id', 'multiple', 'pattern']
        .filter(prop => this[prop] !== false)
        .reduce((attributes, attr) => {
          attributes[attr] = this[attr]
          return attributes
        }, {})
    },
    optionList () {
      if (!Array.isArray(this.options)) {
        return reduce(this.options, (options, value, label) => options.concat({value, label, id: shortid.generate()}), [])
      } else if (Array.isArray(this.options) && !this.options.length) {
        return [{value: this.name, label: (this.label || this.name), id: shortid.generate()}]
      }
      return this.options
    },
    val: {
      set (value) {
        this.form.update({field: this.name, value})
        if (this.isTextInput) {
          this.$refs.input.value = value
        }
      },
      get () {
        return this.value
      }
    }
  },
  watch: {
    localAndValidationErrors () {
      if (!equals(this.localAndValidationErrors, this.storeErrors)) {
        this.form.updateFieldErrors({
          field: this.name,
          errors: this.localAndValidationErrors
        })
      }
    },
    initial () {
      this.form.update({field: this.name, value: this.initial})
    }
  },
  created () {
    if (typeof window === 'undefined') {
      this.register()
    }
  },
  mounted () {
    this.register()
  },
  beforeDestroy () {
    this.form.deregisterField(this.name)
  },
  methods: {
    register () {
      this.form.registerField(
        this.name,
        filter(this.$props, (prop, value) => ['name', 'type', 'id', 'label', 'validation', 'validationLabel'].includes(prop))
      )
      if (this.initial !== false) {
        this.form.setInitial(this.name, this.initial)
      }
    }
  }
}
</script>
