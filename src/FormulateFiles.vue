<template>
  <ul
    v-if="fileUploads.length"
    class="formulate-files"
  >
    <li
      v-for="file in fileUploads"
      :key="file.uuid"
      class="formulate-file"
    >
      <span
        class="formualte-file-name"
        v-text="file.name"
      />
      <span
        v-if="file.progress > 0 && file.progress < 100"
        v-text="`${file.progress}%`"
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
    }
  },
  computed: {
    fileUploads () {
      return this.files.files || []
    }
  }
}
</script>
