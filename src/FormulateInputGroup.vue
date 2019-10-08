<template>
  <div class="formulate-input-group">
    <component
      :is="optionContext.component"
      v-for="optionContext in optionsWithContext"
      :key="optionContext.id"
      v-model="context.model"
      v-bind="optionContext"
      class="formulate-input-group-item"
    />
  </div>
</template>

<script>
export default {
  name: 'FormulateInputGroup',
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    options () {
      return this.context.options || []
    },
    optionsWithContext () {
      const { options, labelPosition, attributes, classification, ...context } = this.context
      return this.options.map(option => this.groupItemContext(context, option))
    }
  },
  methods: {
    groupItemContext (...args) {
      return Object.assign({}, ...args, {
        component: 'FormulateInput'
      })
    }
  }
}
</script>
