<template>
  <div id="app">
    <formulate
      name="registration"
      class="my-form"
      v-if="!values"
      @submit="useFormData"
    >
      <formulate-element
        name="email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        validation="required|email"
      />
      <formulate-element
        name="password_confirmation"
        type="password"
        label="Password"
        placeholder="Choose a password"
        validation="required"
      />
      <formulate-element
        name="password"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        validation-label="Password"
        validation="required|confirmed"
      />
      <formulate-element
        type="submit"
        name="Save"
      />
    </formulate>
    <code
      v-else
      class="my-form my-form--code"
      v-text="values"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      values: false
    }
  },
  methods: {
    useFormData (vals) {
      this.values = JSON.stringify(vals, null, 2)
    }
  }
}
</script>

<style>
html,
body {
  min-height: 100%;
}
body {
  background: linear-gradient(to top left, #35495e, #41b883);
  background-repeat: no-repeat;
  padding: 0;
  border: 0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
}

code {
  white-space: pre;
}
::-webkit-input-placeholder {
  color: lightgray;
}
::-moz-placeholder {
  color: lightgray;
}
:-ms-input-placeholder {
  color: lightgray;
}
:-moz-placeholder {
  color: lightgray;
}

.my-form {
  box-sizing: border-box;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, .2);
  max-width: 500px;
  background-color: white;
  border-radius: .25em;
  padding: 2em;
  position: absolute;
  min-width: 500px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.formulate-element {
  font-size: 1em;
  margin-bottom: 1em;
}

.formulate-element:last-child {
  margin-bottom: 0;
}

.formulate-errors {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.formulate-errors li {
  margin: .25em 0;
  font-size: 14px;
  color: red;
  font-style: italic;
}

label {
  display: block;
  font-weight: normal;
  font-weight: bold;
  margin-bottom: .5em;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  border: 1px solid gainsboro;
  box-sizing: border-box;
  font-size: 1em;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: transparent;
  padding: .5em;
  width: 100%;
}
input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  outline: 0;
  border-color: #41b883;
}

button {
  box-sizing: border-box;
  border: 1px solid #41b883;
  border-radius: 2em;
  background-color: #41b883;
  color: white;
  font-size: 1em;
  width: 100%;
  padding: .75em;
  text-transform: uppercase;
  text-align: center;
  min-width: 100%;
}

button:focus {
  outline: 0;
  border-color: #35495e;
}
</style>
