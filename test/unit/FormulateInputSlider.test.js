import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '@/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputSlider from '@/inputs/FormulateInputSlider.vue'

Vue.use(Formulate)

/**
 * Test each type of slider element
 */

describe('FormulateInputSlider', () => {
  it('renders range input when type is "range"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range' } })
    expect(wrapper.contains(FormulateInputSlider)).toBe(true)
  })

  it('does not show value if the show-value prop is not set', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range', value: '15', min: '0', max: '100' } })
    expect(wrapper.find('.formulate-input-element-range-value').exists()).toBe(false)
  })

  it('renders the value when type is "range" and show-value prop is set', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range', showValue: 'true', value: '15', min: '0', max: '100' } })
    expect(wrapper.find('.formulate-input-element-range-value').text()).toBe('15')
  })
})
