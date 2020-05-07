<template>
  <div class="specimens specimens--group">
    <FormulateForm
      v-model="formData"
      @submit="save"
    >
      <FormulateInput
        v-model="users"
        name="users"
        label="Invite some new users"
        type="group"
        placeholder="users"
        help="Fields can be grouped"
        :repeatable="true"
      >
        <FormulateInput
          label="First and last name"
          name="name"
          type="text"
          placeholder="User’s name"
        />
        <FormulateInput
          v-model="email"
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
    <pre>{{ formData }}</pre>
    <span>Save Values</span>
    <pre>{{ saveValues }}</pre>
    <pre>{{ email }}</pre>
    <pre>{{ users }}</pre>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
      },
      users: [
        { name: 'Justin' },
        { name: 'Bob' }
      ],
      email: 'justin@wearebraid.com',
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
