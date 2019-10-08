/**
 * Default base for input components.
 */
export default {
  model: {
    prop: 'formulateValue',
    event: 'input'
  },
  props: {
    context: {
      type: Object,
      required: true
    },
    formulateValue: {
      type: [Object, Array, Boolean, String, Number],
      default: ''
    }
  },
  computed: {
    type () {
      return this.context.type
    },
    id () {
      return this.context.id
    },
    attributes () {
      return this.context.attributes || {}
    },
    hasValue () {
      return !!this.model
    }
  }
}
