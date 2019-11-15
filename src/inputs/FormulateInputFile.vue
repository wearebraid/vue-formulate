<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    :data-has-files="hasFiles"
  >
    <div
      class="formulate-input-upload-area"
      :data-has-files="hasFiles"
    >
      <input
        ref="file"
        :data-is-drag-hover="isOver"
        type="file"
        v-bind="attributes"
        @blur="context.blurHandler"
        @change="handleFile"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
      <div
        v-show="!hasFiles"
        class="formulate-input-upload-area-mask"
      />
      <FormulateFiles
        v-if="hasFiles"
        :files="context.model"
      />
    </div>
  </div>
</template>

<script>
import FormulateInputMixin from '../FormulateInputMixin'
import FileUpload from '../FileUpload'
import FormulateFiles from '../FormulateFiles.vue'

export default {
  name: 'FormulateInputFile',
  components: {
    FormulateFiles
  },
  mixins: [FormulateInputMixin],
  data () {
    return {
      isOver: false
    }
  },
  computed: {
    hasFiles () {
      return (this.context.model instanceof FileUpload && this.context.model.files.length)
    }
  },
  methods: {
    handleFile () {
      const input = this.$refs.file
      if (input.files.length) {
        this.context.model = this.$formulate.createUpload(input.files, this.context)
      }
      if (this.context.immediateUpload && this.context.model instanceof FileUpload) {
        this.context.model.upload()
      }
    },
    handleDragOver (e) {
      e.preventDefault()
      this.isOver = true
    },
    handleDragLeave (e) {
      e.preventDefault()
      this.isOver = false
    }
  }
}
</script>
