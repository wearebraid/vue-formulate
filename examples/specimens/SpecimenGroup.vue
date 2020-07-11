<template>
  <div class="specimens specimens--group">
    <h2>Group classification</h2>
    <div class="specimen">
      <h3>Non-repeatable group</h3>
      <FormulateForm>
        <FormulateInput
          type="group"
        >
          <FormulateInput
            label="City"
            type="text"
            name="city"
            validation="omaha"
            :validation-rules="{
              omaha: ({ value }) => value === 'Omaha'
            }"
            :validation-messages="{
              omaha
            }"
          />
          <FormulateInput
            label="State"
            type="select"
            :options="{NE: 'Nebraska', MO: 'Missouri', VA: 'Virginia'}"
            placeholder="Select a state"
          />
        </FormulateInput>
      </FormulateForm>
    </div>
    <div class="specimen">
      <h3>Repeatable group</h3>
      <FormulateInput
        v-model="test"
        name="users"
        label="Invite some new users"
        type="group"
        placeholder="users"
        help="Fields can be grouped"
        :repeatable="true"
        minimum="3"
      >
        <FormulateInput
          label="First and last name"
          name="name"
          type="text"
          placeholder="User’s name"
          validation="required"
        />
        <FormulateInput
          name="email"
          label="Email address"
          type="email"
          placeholder="User’s email"
          validation="required|email"
        />
      </FormulateInput>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      test: undefined
    }
  },
  methods: {
    omaha (context) {
      console.log(context.formValues)
      return 'not omaha'
    }
  }
}
</script>
