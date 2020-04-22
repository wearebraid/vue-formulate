<template>
  <div class="formulate-input-group-add-more">
    <FormulateInput
      type="button"
      label="Add more"
      @click.native="$emit('add')"
    />
  </div>
</template>

<script>
export default {

}
</script>
