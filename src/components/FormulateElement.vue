<template>
  <div class="formulate-element">
    <div class="formulate-element-input-wrapper">
      <!-- TEXT STYLE INPUTS -->
      <label
        :for="id"
        v-text="label"
        v-if="label && isTextInput"
      />
      <input
        ref="input"
        :type="type"
        :name="name"
        :id="id"
        v-model="val"
        v-if="isTextInput"
      >
      <!-- BUTTON INPUTS -->
      <button
        :type="type"
        v-text="label || name"
        v-if="isButtonInput"
        :disabled="type === 'submit' && form.hasErrors"
      />
      <!-- SELECT INPUTS -->

      <!-- CHECKBOX INPUTS -->

      <!-- RADIO INPUTS -->

      <!-- CUSTOM SLOT INPUTS -->
      <slot v-if="hasCustomInput" />
    </div>
    <ul
      class="formulate-errors"
      v-if="localAndValidationErrors.length"
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
import {inputTypes} from '../utils'
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
    isListInput () {
      return !this.hasCustomInput && inputTypes.list.includes(this.type)
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
      return this.values[this.name]
    },
    module () {
      return this.form.$props['module']
    },
    formName () {
      return this.form.$props['name']
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
    attributes () {
      return this.$props
    },
    val: {
      set (value) {
        this.form.update({field: this.name, value})
        this.$refs.input.value = value
      },
      get () {
        return this.value
      }
    }
  },
  watch: {
    errors () {
      this.form.updateFieldErrors({
        field: this.name,
        errors: this.localAndValidationErrors
      })
    }
  },
  created () {
    if (this.initial !== false) {
      this.form.hydrate({[this.name]: this.initial})
    }
  }
}
</script>
