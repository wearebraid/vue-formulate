<template>
  <ul
    v-if="fileUploads.length"
    :class="context.classes.files"
  >
    <li
      v-for="file in fileUploads"
      :key="file.uuid"
      :data-has-error="!!file.error"
      :data-has-preview="!!(imagePreview && file.previewData)"
    >
      <div :class="context.classes.file">
        <div
          v-if="!!(imagePreview && file.previewData)"
          :class="context.classes.fileImagePreview"
        >
          <img
            :src="file.previewData"
          >
        </div>
        <div
          :class="context.classes.fileName"
          :title="file.name"
          v-text="file.name"
        />
        <div
          v-if="file.progress !== false"
          :data-just-finished="file.justFinished"
          :data-is-finished="!file.justFinished && file.complete"
          :class="context.classes.fileProgress"
        >
          <div
            :class="context.classes.fileProgressInner"
            :style="{width: file.progress + '%'}"
          />
        </div>
        <div
          v-if="(file.complete && !file.justFinished) || file.progress === false"
          :class="context.classes.fileRemove"
          @click="file.removeFile"
        />
      </div>
      <div
        v-if="file.error"
        :class="context.classes.fileUploadError"
        v-text="file.error"
      />
    </li>
  </ul>
</template>

<script>
import FileUpload from './FileUpload'

export default {
  name: 'FormulateFiles',
  props: {
    files: {
      type: FileUpload,
      required: true
    },
    imagePreview: {
      type: Boolean,
      default: false
    },
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    fileUploads () {
      return this.files.files || []
    }
  },
  watch: {
    files () {
      if (this.imagePreview) {
        this.files.loadPreviews()
      }
    }
  },
  mounted () {
    if (this.imagePreview) {
      this.files.loadPreviews()
    }
  }
}
</script>
