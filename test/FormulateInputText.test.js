import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../dist/formulate.esm.js'
import FormulateInput from '../src/FormulateInput.vue'
import FormulateInputText from '../src/inputs/FormulateInputText.vue'

Vue.use(Formulate)

/**
 * Test each type of text element
 */

test('type "text" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "search" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'search' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "email" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'email' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "number" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'number' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "color" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'color' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "date" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'date' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "month" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'month' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "password" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'password' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "range" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'range' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "tel" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'tel' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "time" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'time' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "url" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'url' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

test('type "week" renders a text input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'week' } })
  expect(wrapper.contains(FormulateInputText)).toBe(true)
})

/**
 * Test functionality to text inputs
 */

 test('text inputs automatically have id assigned', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.vm.context).toHaveProperty('id')
  expect(wrapper.find(`input[id="${wrapper.vm.id}"]`).exists()).toBe(true)
 })

test('text inputs dont have labels', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.find('label').exists()).toBe(false)
})

test('text inputs can have labels', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text', label: 'Field label' } })
  expect(wrapper.find(`label[for="${wrapper.vm.id}"]`).exists()).toBe(true)
})

test('text inputs dont have help text', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.find(`.formulate-input-help`).exists()).toBe(false)
})

test('text inputs dont have help text', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text', help: 'This is some help text' } })
  expect(wrapper.find(`.formulate-input-help`).exists()).toBe(true)
})
