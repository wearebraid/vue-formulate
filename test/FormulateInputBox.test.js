import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../dist/formulate.esm.js'
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
