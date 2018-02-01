<template>
  <div :class="classes">
    <div class="formulate-element-input-wrapper">
      <!-- TEXT STYLE INPUTS -->
      <label
        :for="id"
        v-text="label"
        v-if="label && (!isBoxInput || optionList.length > 1)"
      />
      <input
        ref="input"
        :type="type"
        :name="name"
        v-model="val"
        v-bind="attributes"
        v-if="isTextInput"
        @blur="errorBlurState = true"
      >
      <!-- BUTTON INPUTS -->
      <button
        :type="type"
        v-text="label || name"
        v-if="isButtonInput"
        :disabled="type === 'submit' && (form.hasErrors && form.behavior === 'live')"
      />
      <!-- SELECT INPUTS -->
      <select
        v-bind="attributes"
        v-if="isSelectInput"
        :name="name"
        v-model="val"
        @blur="errorBlurState = true"
      >
        <option
          v-for="option in optionList"
          :value="option.value"
          :key="option.id"
          v-text="option.label"
        />
      </select>
      <!-- BOX INPUTS -->
      <div
        class="formulate-element-box-input-group"
        v-if="isBoxInput"
      >
        <template v-for="option in optionList">
          <input
            type="radio"
            :name="name"
            :id="option.id"
            :value="option.value"
            :key="`${option.id}-input`"
            v-bind="attributes"
            v-model="val"
            v-if="type === 'radio'"
            @blur="errorBlurState = true"
          >
          <input
            type="checkbox"
            :name="name"
            :id="option.id"
            :value="option.value"
            :key="`${option.id}-input`"
            v-bind="attributes"
            v-model="val"
            v-if="type === 'checkbox'"
            @blur="errorBlurState = true"
          >
          <label
            :for="option.id"
            :key="`${option.id}-label`"
            v-text="option.label"
          />
        </template>
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
    <ul
      class="formulate-errors"
      v-if="shouldShowErrors && localAndValidationErrors.length"
    >
      <li
        v-for="error in localAndValidationErrors"
        v-text="error"
        :key="error"
      />
    </ul>
  </div>
</template>

<script>
import {inputTypes, equals, reduce} from '../utils'
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
      type: [String, Boolean],
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
    placeholder: {
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
    }
  },
  data () {
    return {
      errorBlurState: false
    }
  },
  computed: {
    hasCustomInput () {
      return (this.$slots.default && this.$slots.default.length)
    },
    isTextInput () {
      return !this.hasCustomInput && inputTypes.text.includes(this.type)
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
      return (!this.hasCustomInput && !this.isTextInput && !this.isButtonInput && !this.isSelectInput && !this.isBoxInput)
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
            value = '#000000'
            break
          case 'checkbox':
            if (this.optionList.length > 1) {
              value = []
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
        'formulate-element--has-value': !!this.value,
        'formulate-element--has-errors': this.localAndValidationErrors.length && this.shouldShowErrors
      }
    },
    validationErrors () {
      return this.form.validationErrors[this.name] || []
    },
    storeErrors () {
      return this.form.errors[this.name] || []
    },
    localAndValidationErrors () {
      return this.errors.concat(this.validationErrors)
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
      return ['min', 'max', 'placeholder', 'id', 'multiple']
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
    }
  },
  created () {
    this.form.registerField(this.name, this.$props)
    if (this.initial !== false) {
      this.form.hydrate({[this.name]: this.initial})
    }
  }
}
</script>
