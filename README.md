<p align="center"><a href="https://vueformulate.com" target="_blank" rel="noopener noreferrer"><img width="100" src="https://assets.wearebraid.com/vue-formulate/logo.png" alt="VueFormulate"></a></p>

<p align="center">
  <a href="https://travis-ci.org/wearebraid/vue-formulate"><img src="https://travis-ci.org/wearebraid/vue-formulate.svg?branch=master"></a>
  <a href="https://www.npmjs.com/package/@braid/vue-formulate"><img alt="npm" src="https://img.shields.io/npm/v/@braid/vue-formulate"></a>
  <a href="https://github.com/wearebraid/vue-formulate"><img alt="GitHub" src="https://img.shields.io/github/license/wearebraid/vue-formulate"></a>
  <a href=""><img src="https://img.badgesize.io/wearebraid/vue-formulate/master/dist/index.js.svg?compression=gzip&label=gzip"></a>
</p>

<p align="center">
  <a href="https://vueformulate.com">Documentation Website</a>
</p>

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

✓ Create any input element with a single component<br>
✓ Supports Vue `v-model` [binding](https://vueformulate.com/guide/#model-binding)<br>
✓ [Re-populate an entire form](https://vueformulate.com//guide/forms/#setting-initial-values) from a single object<br>
✓ [Generate a form](https://vueformulate.com//guide/forms/#generating-forms) using json<br>
✓ Easy to add field labels<br>
✓ Easy to add help text<br>
✓ Easy to add [form validation](https://vueformulate.com//guide/validation)<br>
✓ Easy to add [custom validation](https://vueformulate.com//guide/validation/#custom-validation-rules) rules<br>
✓ Easy to modify [validation messages](https://vueformulate.com//guide/validation/#customize-validation-messages)<br>
✓ Easy to add [custom inputs](https://vueformulate.com//guide/custom-inputs)

There's a lot more available to read at the [documentation website](https://vueformulate.com).
