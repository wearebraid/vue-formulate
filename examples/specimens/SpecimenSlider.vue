<template>
  <div class="specimens specimens--text">
    <h2>Slider classification</h2>
    <div class="specimen specimen--single">
      <h3>Range</h3>
      <FormulateInput
        label="How far should we crank it up?"
        type="range"
        min="0"
        max="11"
        :show-value="true"
        help="Whenever we’re allowed to have a party again..."
      />
    </div>
    <div class="specimen">
      <h3>Range with Prefix and Suffix</h3>
      <FormulateInput
        label="How much time do you spend coding per day?"
        type="range"
        min="0"
        max="100"
        step="10"
        value="20"
        prefix="~"
        suffix="%"
        :show-value="true"
        help="Around..."
      />
    </div>
  </div>
</template>
