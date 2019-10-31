import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../src/Formulate.js'
import FormulateInput from '../src/FormulateInput.vue'
import FormulateInputBox from '../src/inputs/FormulateInputBox.vue'
import FormulateInputGroup from '../src/FormulateInputGroup.vue'

Vue.use(Formulate)

test('type "checkbox" renders a box element', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox' } })
  expect(wrapper.contains(FormulateInputBox)).toBe(true)
})

test('type "radio" renders a box element', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'radio' } })
  expect(wrapper.contains(FormulateInputBox)).toBe(true)
})

test('box inputs properly process options object in context library', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'} } })
  expect(Array.isArray(wrapper.vm.context.options)).toBe(true)
})

test('type "checkbox" with options renders a group', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'} } })
  expect(wrapper.contains(FormulateInputGroup)).toBe(true)
})

test('type "radio" with options renders a group', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
  expect(wrapper.contains(FormulateInputGroup)).toBe(true)
})


test('labelPosition of type "checkbox" defaults to after', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox' } })
  expect(wrapper.vm.context.labelPosition).toBe('after')
})

test('labelPosition of type "checkbox" with options defaults to before', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'}}})
  expect(wrapper.vm.context.labelPosition).toBe('before')
})


test('type radio renders multiple inputs with options', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
  expect(wrapper.findAll('input[type="radio"]').length).toBe(2)
})

test('type "radio" auto generate ids if not provided', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
  expect(wrapper.findAll('input[type="radio"]').is('[id]')).toBe(true)
})

/**
 * Test data binding
 */

 test('type "checkbox" sets array of values via v-model', () => {
  const wrapper = mount({
    data () {
      return {
        checkboxValues: []
      }
    },
    template: `
      <div>
        <FormulateInput type="checkbox" v-model="checkboxValues" :options="{foo: 'Foo', bar: 'Bar', fooey: 'Fooey'}" />
      </div>
    `
  })
  const fooInputs = wrapper.findAll('input[value^="foo"]')
  expect(fooInputs.length).toBe(2)
  fooInputs.setChecked(true)
  expect(wrapper.vm.checkboxValues).toEqual(['foo', 'fooey'])
})
