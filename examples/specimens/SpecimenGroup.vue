<template>
  <div class="specimens specimens--group">
    <FormulateInput
      label="Invite some new users"
      type="group"
      placeholder="users"
      help="Fields can be grouped"
    >
      <FormulateInput
        label="First and last name"
        name="Name"
        type="text"
        placeholder="User’s name"
      />
      <FormulateInput
        name="Email"
        label="Email address"
        type="email"
        placeholder="User’s email"
        validation="required|email"
      />
    </FormulateInput>
  </div>
</template>
