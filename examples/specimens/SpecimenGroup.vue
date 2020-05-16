<template>
  <div class="specimens specimens--group">
    <h2>Non-repeatable group</h2>
    <FormulateInput
      type="group"
    >
      <FormulateInput
        label="City"
        type="text"
        name="city"
      />
      <FormulateInput
        label="State"
        type="select"
        :options="{NE: 'Nebraska', MO: 'Missouri', VA: 'Virginia'}"
        placeholder="Select a state"
      />
    </FormulateInput>
    <h2>Repeatable group</h2>
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
          validation="required"
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
    <!-- <span>Form Values</span>
    <pre>{{ formData }}</pre>
    <span>Save Values</span> -->
    <pre>{{ saveValues }}</pre>
    <!-- <pre>{{ email }}</pre>
    <pre>{{ users }}</pre> -->
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
        {}
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
