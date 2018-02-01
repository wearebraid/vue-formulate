# Vue Formulate
---------------
[![Build Status](https://travis-ci.org/wearebraid/vue-formulate.svg?branch=master)](https://travis-ci.org/wearebraid/vue-formulate)

### What is it?

Vue Formulate is a [Vue](https://vuejs.org/) plugin that exposes an elegant
mechanism for building and validating forms with a centralized data store.

### Installation

First download the `vue-formulate` package from npm:

```sh
npm install vue-formulate
```

Install `vue-formulate` like any other vue plugin:

```js
import Vue from 'vue'
import formulate from 'vue-formulate'

Vue.use(formulate)
```
Finally `vue-formulate` needs to access your vuex store. You can choose to.

### Usage

`vue-formulate` automatically registers two components `formulate` and
`formulate-element`. These two elements are able to address most of your form
building needs. Here's a simple example:

```html
<template>
  <formulate name="registration">
    <formulate-element
      name="name"
      type="text"
      label="What is your name?"
      validation="required"
    />
    <formulate-element
      name="email"
      type="email"
      label="What is your email address?"
      validation="required(Email address)|email"
    />
    <formulate-element
      type="submit"
      name="Register"
    />
  </formulate>
</template>
```

### Validation Rules

There are several built in validation methods and you are easily able to add
your own.

Rule      |  Arguments
----------|---------------
required  | label
email     | label
confirmed | label, confirmation field

You can add as many validation rules as you want to each `formulate-element`, 
simply chain your rules with pipes `|'.

```
validation="required(My Label)|confirmed(Password Field, confirmation_field)"
```

Adding your own validation rules is simple, simply pass an additional object
of rules in your installation:

```js
Vue.use(formulate, {
  rules: {
    isPizza: ({field, value, error, values}, label) => value === 'pizza' ? false : `${label || field} is not pizza.`
  }
})
```

Validation rules expect a return of `false` if there are no errors, or a error
message string. Validation rules are all passed an object with the `field` name,
`value` of the field, `error` function to generate an error message, and all the
`values` of the entire form.

### Full Documentation

There are many more options available, more documentation coming soon.
