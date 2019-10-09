<template>
  <form
    @submit.prevent="formSubmitted"
  >
    <slot />
  </form>
</template>

<script>
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
    }
  },
  methods: {
    setFieldValue (field, value) {
      this.formModel = Object.assign({}, this.formulateValue, { [field]: value })
    },
    register (field, component) {
      this.registry[field] = component
    }
  }
}
</script>
