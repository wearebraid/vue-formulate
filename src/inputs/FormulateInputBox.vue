<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
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
      @blur="context.blurHandler"
    >
    <input
      v-else
      v-model="context.model"
      type="checkbox"
      :value="context.value"
      v-bind="attributes"
      @blur="context.blurHandler"
    >
    <label
      class="formulate-input-element-decorator"
      :for="id"
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
