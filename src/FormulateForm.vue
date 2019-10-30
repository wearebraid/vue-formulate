<template>
  <form
    @submit.prevent="formSubmitted"
  >
    <slot />
  </form>
</template>

<script>
import { shallowEqualObjects } from './libs/utils'

export default {
  provide () {
    return {
      formulateFormSetter: this.setFieldValue,
      formulateFormRegister: this.register
    }
  },
  name: 'FormulateForm',
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    name: {
      type: [String, Boolean],
      default: false
    },
    formulateValue: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      registry: {}
    }
  },
  computed: {
    formModel: {
      get () {
        return this.formulateValue
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    hasFormulateValue () {
      return this.formulateValue && typeof this.formulateValue === 'object'
    },
    isVmodeled () {
      return !!(this.$options.propsData.hasOwnProperty('formulateValue') &&
        this._events &&
        Array.isArray(this._events.input) &&
        this._events.input.length)
    }
  },
  watch: {
    formulateValue: {
      handler (newValue, oldValue) {
        if (this.isVmodeled &&
          newValue &&
          typeof newValue === 'object'
        ) {
          for (const field in newValue) {
            if (this.registry.hasOwnProperty(field) && !shallowEqualObjects(newValue[field], this.registry[field].internalModelProxy)) {
              // If the value of the formulateValue changed (probably as a prop)
              // and it doesn't match the internal proxied value of the registered
              // component, we set it explicitly. Its important we check the
              // model proxy here since the model itself is not fully synchronous.
              this.registry[field].context.model = newValue[field]
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    setFieldValue (field, value) {
      this.formModel = Object.assign({}, this.formulateValue, { [field]: value })
    },
    register (field, component) {
      this.registry[field] = component
      if (!component.$options.propsData.hasOwnProperty('formulateValue') && this.hasFormulateValue && this.formulateValue[field]) {
        // In the case that the form is carrying an initial value and the
        // element is not, set it directly.
        component.context.model = this.formulateValue[field]
      }
    }
  }
}
</script>
