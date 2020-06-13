import Vue from 'vue'
import flushPromises from 'flush-promises'
import { mount } from '@vue/test-utils'
import Formulate from '@/Formulate.js'
import FormulateSchema from '@/FormulateSchema.js'
import FormulateInput from '@/FormulateInput.vue'

Vue.use(Formulate)

describe('FormulateSchema', () => {
  it('renders a FormulateInput by default', async () => {
    const wrapper = mount(FormulateSchema, { propsData: { schema: [
      {}
    ]}})
    expect(wrapper.findComponent(FormulateInput).exists()).toBe(true)
  })

  it('can render a standard div', async () => {
    const wrapper = mount(FormulateSchema, { propsData: { schema: [
      { component: 'div', class: 'test-div' }
    ]}})
    expect(wrapper.find('.test-div').exists()).toBe(true)
  })

  it('can render children', async () => {
    const wrapper = mount(FormulateSchema, { propsData: { schema: [
      { component: 'div', class: 'test-div', children: [{}] }
    ]}})
    expect(wrapper.find('.test-div .formulate-input').exists()).toBe(true)
  })

  it('can render children inside a group input', async () => {
    const wrapper = mount(FormulateSchema, { propsData: { schema: [
      { type: 'group', repeatable: true, children: [{}] }
    ]}})
    expect(wrapper.findAll('.formulate-input').length)
      .toBe(3)
    wrapper.find('.formulate-input-group-add-more button').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.formulate-input').length)
      .toBe(4)
  })

  it('renders text nodes inside dom elements', async () => {
    const wrapper = mount(FormulateSchema, { propsData: { schema: [
      { component: 'h2', children: 'Hello world' }
    ]}})
    expect(wrapper.find('h2').text()).toBe('Hello world')
  })
})
