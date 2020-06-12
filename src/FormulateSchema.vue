<template>
  <div class="formulate-schema-group">
    <component
      :is="item.component"
      v-for="item in items"
      :key="item.key"
      v-bind="item.attrs"
    >
      <FormulateSchema
        v-if="item.children"
        :schema="item.children"
      />
    </component>
  </div>
</template>

<script>
import { createItem } from './libs/utils'

export default {
  props: {
    schema: {
      type: Array,
      required: true
    }
  },
  computed: {
    items () {
      return this.schema.map(item => createItem(item))
    }
  }
}
</script>
