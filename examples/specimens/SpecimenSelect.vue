<template>
  <div class="specimens specimens--text">
    <h2>Select classification</h2>
    <div class="specimen specimen--single">
      <h3>Select</h3>
      <FormulateInput
        label="What planet is the hottest?"
        type="select"
        :options="{mercury: 'Mercury', venus: 'Venus', earth: 'Earth', mars: 'Mars'}"
        help="Average temperature on the surface of the planet."
      />
    </div>
    <div class="specimen specimen--single">
      <h3>Select with placeholder</h3>
      <FormulateInput
        label="What planet is the hottest?"
        type="select"
        placeholder="Select a planet"
        :options="{mercury: 'Mercury', venus: 'Venus', earth: 'Earth', mars: 'Mars'}"
        help="Average temperature on the surface of the planet."
      />
    </div>
  </div>
</template>
