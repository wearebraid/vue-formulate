<template>
  <div>
    <FormulateInput
      type="group"
      :repeatable="true"
      name="invitees"
      :group-errors="{
        '0.email': 'This email is already in use.',
        '1.name': 'Yeah...pretty sure “Rensmold” isn’t a real last name.'
      }"
      :value="[
        { name: 'Todd Berkins', email: 'todd@example.com' },
        { name: 'Stella Rensmold', email: 'stella@example.com' },
      ]"
    >
      <FormulateInput
        name="name"
        label="Invitee's name"
      />
      <FormulateInput
        name="email"
        label="What is this user's email?"
      />
    </FormulateInput>

    <!-- <FormulateForm
      :errors="{
        organization: ['This organization name is taken'],
        users: ['Please create another user', 'And after that create yet another'],
        'users.0.email': ['This email address is taken.'],
        'users.1.name': 'You have an ugly name. Access denied',
        'users.1.flavors': 'Please select at least 1 flavor',
        'users.1.flavors.0.flavor': 'Just dont pick strawberry',
      }"
    >
      <FormulateInput
        type="text"
        label="Organization name"
        name="organization"
      />
      <FormulateInput
        v-model="groupValues"
        type="group"
        name="users"
        help="enter some people's names"
        label="Add users"
        :repeatable="true"
        :errors="['This should show up under the group']"
        :group-errors="{
          '0.name': 'Please choose a different name [merged from group]'
        }"
      >
        <FormulateInput
          name="name"
          error="Choose a better name please"
        />
        <FormulateInput
          name="email"
        />
        <FormulateInput
          type="group"
          name="flavors"
          :repeatable="true"
        >
          <FormulateInput
            name="flavor"
          />
        </FormulateInput>
      </FormulateInput>
    </FormulateForm> -->
  </div>
</template>

<script>
/* eslint-disable */
// export default {
//   data () {
//     return {
//       groupValues: [
//         { name: 'Justin', email: 'justin@wearebraid.com'},
//         { name: 'Bill', email: 'bill@wearebraid.com', flavors: [{ flavor: 'Strawberry'}, {flavor: 'Apple'}]},
//       ]
//     }
//   }
// };
</script>

