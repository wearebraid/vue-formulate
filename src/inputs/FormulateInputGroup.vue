<template>
  <div
    :class="context.classes.element"
    :data-is-repeatable="context.repeatable"
  >
    <template
      v-if="subType !== 'grouping'"
    >
      <FormulateInput
        v-for="optionContext in optionsWithContext"
        :key="optionContext.id"
        v-model="context.model"
        v-bind="optionContext"
        :disable-errors="true"
        class="formulate-input-group-item"
        @blur="context.blurHandler"
      />
    </template>
    <template
      v-else
    >
      <FormulateGrouping
        :context="context"
      >
        <slot />
      </FormulateGrouping>
      <FormulateSlot
        v-if="canAddMore"
        name="addmore"
        :context="context"
        :add-more="addItem"
      >
        <component
          :is="context.slotComponents.addMore"
          :context="context"
          :add-more="addItem"
          v-bind="context.slotProps.addMore"
          @add="addItem"
        />
      </FormulateSlot>
    </template>
  </div>
</template>

<script>
import { setId } from '../libs/utils'

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
    subType () {
      return (this.context.type === 'group') ? 'grouping' : 'inputs'
    },
    optionsWithContext () {
      const {
        // The following are a list of items to pull out of the context object
        attributes: { id, ...groupApplicableAttributes },
        blurHandler,
        classification,
        component,
        getValidationErrors,
        hasLabel,
        hasValidationErrors,
        isSubField,
        isValid,
        labelPosition,
        options,
        performValidation,
        setErrors,
        slotComponents,
        slotProps,
        validationErrors,
        visibleValidationErrors,
        classes,
        showValidationErrors,
        rootEmit,
        help,
        pseudoProps,
        ...context
      } = this.context
      return this.options.map(option => this.groupItemContext(
        context,
        option,
        groupApplicableAttributes
      ))
    },
    totalItems () {
      return Array.isArray(this.context.model) ? this.context.model.length : this.context.minimum || 1
    },
    canAddMore () {
      return (this.context.repeatable && this.totalItems < this.context.limit)
    }
  },
  methods: {
    addItem () {
      if (Array.isArray(this.context.model)) {
        return this.context.model.push(setId({}))
      }
      this.context.model = (new Array(this.totalItems + 1)).fill('').map(() => setId({}))
    },
    groupItemContext (context, option, groupAttributes) {
      const optionAttributes = { isGrouped: true }
      const ctx = Object.assign({}, context, option, groupAttributes, optionAttributes, !context.hasGivenName ? {
        name: true
      } : {})
      return ctx
    }
  }
}
</script>
