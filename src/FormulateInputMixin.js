/**
 * Default base for input components.
 */
export default {
  props: {
    context: {
      type: Object,
      required: true
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
      return !!this.context.model
    }
  }
}
