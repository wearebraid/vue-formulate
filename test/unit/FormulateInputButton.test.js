import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '@/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputButton from '@/inputs/FormulateInputButton.vue'

Vue.use(Formulate)

test('type "button" renders a button element', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'button' } })
  expect(wrapper.contains(FormulateInputButton)).toBe(true)
})

test('type "submit" renders a button element', () => {
  const wrapper = mount(FormulateInput, { propsData: { type: 'submit' } })
  expect(wrapper.contains(FormulateInputButton)).toBe(true)
})

test('type "button" uses value as highest priority content', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'submit',
    value: 'Value content',
    label: 'Label content',
    name: 'Name content'
  }})
  expect(wrapper.find('button').text()).toBe('Value content')
})

test('type "button" uses label as second highest priority content', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'submit',
    label: 'Label content',
    name: 'Name content'
  }})
  expect(wrapper.find('button').text()).toBe('Label content')
})

test('type "button" uses name as lowest priority content', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'submit',
    name: 'Name content'
  }})
  expect(wrapper.find('button').text()).toBe('Name content')
})

test('type "button" uses "Submit" as default content', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'submit',
  }})
  expect(wrapper.find('button').text()).toBe('Submit')
})

test('type "button" with label does not render label element', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'button',
    label: 'my label'
  }})
  expect(wrapper.find('label').exists()).toBe(false)
})

test('type "submit" with label does not render label element', () => {
  const wrapper = mount(FormulateInput, { propsData: {
    type: 'button',
    label: 'my label'
  }})
  expect(wrapper.find('label').exists()).toBe(false)
})

test('type "button" renders slot inside button', () => {
  const wrapper = mount(FormulateInput, {
    propsData: {
      type: 'button',
      label: 'my label',
    },
    slots: {
      default: '<span>My custom slot</span>'
    }
  })
  expect(wrapper.find('button > span').html()).toBe('<span>My custom slot</span>')
})
