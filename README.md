<p align="center"><a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="100" src="https://assets.wearebraid.com/vue-formualte/logo.png" alt="VueFormulate"></a></p>

<p align="center">
  [![Build Status](https://travis-ci.com/wearebraid/vue-formulate-next.svg?token=4eHp5aiDcHwjrb1T8zpy&branch=version-2)](https://travis-ci.com/wearebraid/vue-formulate-next)
  ![GitHub](https://img.shields.io/github/license/wearebraid/vue-formulate)
</p>

[Documentation Website](https://vueformulate.com)

### What is Vue Formulate?

Vue Formualte is the easiest way to build forms using Vue. Key features include
form and field validation, file uploads, form generation and a single-element
fields with labels, help text, error messages, placeholders and lots more.

The syntax is what developers would expect:

```vue
<FormulateInput
  v-model="value"
  type="email"
  name="email"
  label="What is your email address"
  help="Where should we contact you?"
  validation="required|email"
/>
```

There's a lot more available to read at the [documentation website](https://vueformulate.com).
