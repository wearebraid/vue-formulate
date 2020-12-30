<template>
  <div class="specimens specimens--text">
    <h2>File classification</h2>
    <div class="specimen">
      <h3>Single File</h3>
      <FormulateInput
        label="Upload a file"
        type="file"
        :outer-class="['file-input-1']"
        help="Select any file to upload"
      />
    </div>
    <div class="specimen">
      <h3>Multiple Files</h3>
      <FormulateInput
        :multiple="true"
        label="Upload a file"
        name="file"
        type="file"
        :outer-class="['file-input-2']"
        help="Select any file to upload"
        validation="mime:application/pdf"
      />
    </div>
    <div class="specimen">
      <h3>Image</h3>
      <FormulateInput
        label="What do you look like?"
        type="image"
        help="Select a picture to upload."
        multiple
      />
    </div>
  </div>
</template>
