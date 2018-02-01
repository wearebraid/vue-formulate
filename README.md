# Vue Formulate
---------------
[![Build Status](https://travis-ci.org/wearebraid/vue-formulate.svg?branch=master)](https://travis-ci.org/wearebraid/vue-formulate)
[![Current Version](https://img.shields.io/npm/v/vue-formulate.svg)](https://www.npmjs.com/package/vue-formulate)
[![License](https://img.shields.io/github/license/wearebraid/vue-formulate.svg)](https://github.com/wearebraid/vue-formulate/blob/master/LICENSE.txt)

### What is it?

Vue Formulate is a [Vue](https://vuejs.org/) plugin that exposes an elegant
mechanism for building and validating forms with a centralized data store.

### Get Started

#### Download
First download the `vue-formulate` package from npm:

```sh
npm install vue-formulate
```

#### Installation

Install `vue-formulate` like any other vue plugin:

```js
import Vue from 'vue'
import formulate from 'vue-formulate'

Vue.use(formulate)
```
#### Vuex
`vue-formulate` needs to be linked to your vuex store. Vuex can be
configured as a single root store, or as namespaced modules and `vue-formualte`
can work with either setup.

**Vuex Module**

```js
import {formulateModule} from 'vue-formulate'

export default formulateModule('namespace')
```

Using a namespaced vuex module is the recommended installation method. Just be
sure to replace `'namespace'` with the namespace of your vuex module.

Additionally, when using a vuex namespace, you _must_ also pass the namespace
in the Vue plugin installation call:

```js
Vue.use(formulate, {vuexModule: 'namespace'})
```

Alternatively, you can install `vue-formulate`'s store elements to your vuex
root store:

**Root Store**

```js
import {formulateState, formulateGetters, formulateMutation} from 'vue-formulate'

const state = () => ({
  your: 'data',
  ...formulateState()
})

const getters = {
  yourGetter (state) {
    return state.your
  },
  ...formulateGetters()
}

const mutations = {
  setYour (state, payload) {
    state.your = payload
  },
  ...formulateMutations()
}

export default {
  state,
  getters,
  mutations
}
```

### Usage

`vue-formulate` automatically registers two components `formulate` and
`formulate-element`. These two elements are able to address most of your form
building needs. Here's a simple example:

```html
<formulate name="registration">
  <formulate-element
    name="email"
    type="email"
  />
  ...more formulate-elements
</formulate>
```

You can think of `<formulate>` elements a little bit like traditional
`<form>` tags. You _must_ wrap your `formulate-element` components
in a `<formulate>` component. The `formulate` component has a single
required prop `name` which creates the form’s key in the vuex store.

All `formulate-element` components nested inside a `<formulate>`
component will automatically be commit mutations directly to the
store. The store becomes a live representation of all your form’s
values.

The `formulate-element` component is a powerful component handles field
generation

### Validation Rules

There are several built in validation methods and you are easily able to add
your own.

Rule      |  Arguments
----------|---------------
required  | *none*
email     | *none*
confirmed | confirmation field

You can add as many validation rules as you want to each `formulate-element`, 
simply chain your rules with pipes `|'. Additional arguments can be passed to
validation rules by using parenthesis after the rule name:

```
validation="required|confirmed(confirmation_field)"
```

The field label used in built in validation methods is the `validationLabel`
attribute on your `formulate-element`. If no `validationLabel` is found then
the `label` attribute is used, and if no `label` attribute is found it will
fall back to the field’s `name` attribute (which is required).

#### Custom Validation Rules

Validation rules are easy to write! They're just simple functions that are
always passed at least one argument, an object containing the `field` name,
`value` of the field, validation `label`, `error` function to generate an error
message, and an object containing all the `values` for the entire form.

Additionally, validation rules can pass an unlimited number of extra arguments.
These arguments are passed as the 2nd-nth arguments to the validation rule.
Their values are parsed from the optional parenthesis in the validation
attribute on the `formulate-element`.

```html
<formulate-element
  type="password"
  name="password"
  label="Password"
  validation="confirmed(password_confirmation_field)"
/>
```

Validation rules should return an error message string if they failed, or 
`false` if the input data is valid.

Adding your own validation rules is easy, just pass an additional object
of rule functions in the plugin’s installation call:

```js
Vue.use(formulate, {
  rules: {
    isPizza ({field, value, error, values, label}) {
      return value === 'pizza' ? false : `label is not pizza.`
    }
  }
})
```

### Styling

Absolutely zero styles are included so feel free to write your own! The
`form-element` components have a wrapper `div` that receives the following
classes:

```
formulate-element
formulate-element--has-value
formulate-element--has-errors
```

### Full Documentation

There are many more options available, more documentation coming soon.
