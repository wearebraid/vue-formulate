<template>
  <div class="specimens specimens--group">
    <FormulateForm
      v-model="formResult"
      @submit="save"
    >
      <FormulateInput
        name="users"
        label="Invite some new users"
        type="group"
        placeholder="users"
        help="Fields can be grouped"
      >
        <FormulateInput
          label="First and last name"
          name="name"
          type="text"
          placeholder="User’s name"
        />
        <FormulateInput
          name="email"
          label="Email address"
          type="email"
          placeholder="User’s email"
          validation="required|email"
        />
      </FormulateInput>
      <FormulateInput
        type="submit"
      />
    </FormulateForm>
    <span>Form Values</span>
    <pre>{{ formResult }}</pre>
    <span>Save Values</span>
    <pre>{{ saveValues }}</pre>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formResult: null,
      saveValues: null
    }
  },
  methods: {
    save (values) {
      this.saveValues = values
    }
  }
}
</script>
