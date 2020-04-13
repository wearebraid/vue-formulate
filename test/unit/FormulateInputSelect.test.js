import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '@/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputSelect from '@/inputs/FormulateInputSelect.vue'

Vue.use(Formulate)

describe('FormulateInputSelect', () => {
  it('renders select input when type is "select"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'select' } })
    expect(wrapper.contains(FormulateInputSelect)).toBe(true)
  })

  it('renders select options when options object is passed', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'select', options: { first: 'First', second: 'Second' } } })
    const option = wrapper.find('option[value="second"]')
    expect(option.exists()).toBe(true)
    expect(option.text()).toBe('Second')
  })

  it('renders select options when options array is passed', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'select', options: [
      { value: 13, label: 'Jane' },
      { value: 22, label: 'Jon' }
    ]} })
    const option = wrapper.find('option[value="22"]')
    expect(option.exists()).toBe(true)
    expect(option.text()).toBe('Jon')
  })

  it('renders select list with no options when empty array is passed.', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'select', options: []} })
    const option = wrapper.find('option')
    expect(option.exists()).toBe(false)
  })

  it('renders select list placeholder option.', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'select', placeholder: 'Select this', options: []} })
    const options = wrapper.findAll('option')
    expect(options.length).toBe(1)
    expect(options.at(0).attributes('disabled')).toBeTruthy()
  })
})
