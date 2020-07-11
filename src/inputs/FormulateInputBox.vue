<template>
  <div
    :class="context.classes.element"
    :data-type="context.type"
  >
    <!--
      This explicit break out of types is due to a Vue bug that causes IE11 to
      not when using v-model + dynamic :type + :value (thanks @Christoph-Wagner)
      https://github.com/vuejs/vue/issues/8379
    -->
    <input
      v-if="type === 'radio'"
      v-model="context.model"
      type="radio"
      :value="context.value"
      v-bind="attributes"
      v-on="$listeners"
      @blur="context.blurHandler"
    >
    <input
      v-else
      v-model="context.model"
      type="checkbox"
      :value="context.value"
      v-bind="attributes"
      v-on="$listeners"
      @blur="context.blurHandler"
    >
    <!--
      Ok, so for reasons that we cannot explain, the <label> here will not
      update when the attribute.id changes. Possible bug in core? Either way,
      making this a <component> forces vue to re-render this label when the
      id changes.

      https://github.com/wearebraid/vue-formulate/issues/75
    -->
    <component
      :is="`label`"
      :class="context.classes.decorator"
      :for="attributes.id"
    />
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'

export default {
  name: 'FormulateInputBox',
  mixins: [FormulateInputMixin]
}
</script>
