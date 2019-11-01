import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../src/Formulate'
import FormulateInput from '../src/FormulateInput.vue'
import FormulateInputText from '../src/inputs/FormulateInputText.vue'
import { doesNotReject } from 'assert';

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
 * Test rendering functionality to text inputs
 */

 test('text inputs automatically have id assigned', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.vm.context).toHaveProperty('id')
  expect(wrapper.find(`input[id="${wrapper.vm.context.attributes.id}"]`).exists()).toBe(true)
 })

test('text inputs dont have labels', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.find('label').exists()).toBe(false)
})

test('text inputs can have labels', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text', label: 'Field label' } })
  expect(wrapper.find(`label[for="${wrapper.vm.context.attributes.id}"]`).exists()).toBe(true)
})

test('text inputs dont have help text', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  expect(wrapper.find(`.formulate-input-help`).exists()).toBe(false)
})

test('text inputs dont have help text', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text', help: 'This is some help text' } })
  expect(wrapper.find(`.formulate-input-help`).exists()).toBe(true)
})

/**
 * Test data binding
 */
test('text inputs emit input (vmodel) event with value when edited', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
  wrapper.find('input').setValue('Updated Value')
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input[0]).toEqual(['Updated Value'])
})


test('test that inputs that arent updated dont re-context themselves', () => {
  const wrapper = mount({
    data () {
      return {
        valueA: 'first value',
        valueB: 'second value'
      }
    },
    template: `
      <div>
        <FormulateInput type="text" ref="first" v-model="valueA" :placeholder="valueA" />
        <FormulateInput type="text" ref="second" v-model="valueB" :placeholder="valueB" />
      </div>
    `
  })
  const firstContext = wrapper.find({ref: "first"}).vm.context
  const secondContext = wrapper.find({ref: "second"}).vm.context
  wrapper.find('input').setValue('new value')
  expect(firstContext).toBeTruthy()
  expect(wrapper.vm.valueA === 'new value').toBe(true)
  expect(wrapper.vm.valueB === 'second value').toBe(true)
  expect(wrapper.find({ref: "first"}).vm.context === firstContext).toBe(false)
  expect(wrapper.find({ref: "second"}).vm.context === secondContext).toBe(true)
})

test('test that inputs contain their v-model value as the initial input', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'text', formulateValue: 'initial val' } })
  expect(wrapper.find('input').element.value).toBe('initial val')
})

test('test that inputs without v-model set a proxy model', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'textarea' } })
  const input = wrapper.find('textarea')
  input.setValue('changed value')
  expect(wrapper.vm.internalModelProxy).toBe('changed value')
})
