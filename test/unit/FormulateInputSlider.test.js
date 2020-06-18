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
    expect(wrapper.findComponent(FormulateInputSlider).exists()).toBe(true)
  })

  it('does not show value if the show-value prop is not set', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range', value: '15', min: '0', max: '100' } })
    expect(wrapper.find('.formulate-input-element-range-value').exists()).toBe(false)
  })

  it('renders the value when type is "range" and show-value prop is set', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range', showValue: 'true', value: '15', min: '0', max: '100' } })
    expect(wrapper.find('.formulate-input-element-range-value').text()).toBe('15')
  })

  it('passes an explicitly given name prop through to the root element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range', name: 'foo' } })
    expect(wrapper.find('input[name="foo"]').exists()).toBe(true)
  })

  it('additional context does not bleed through to range input attributes', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range' } } )
    expect(Object.keys(wrapper.find('input[type="range"]').attributes())).toEqual(["type", "id"])
  })

  it('has the proper default element classes', () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'range', elementClass: ['extra']}
    })
    expect(wrapper.findComponent(FormulateInputSlider).attributes('class'))
      .toBe('formulate-input-element formulate-input-element--range extra')
  })

  it('can add classes to the input element', () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'range', inputClass: ['test-class']}
    })
    expect(wrapper.find('input').attributes('class'))
      .toBe('test-class')
  })

  it('allows override of the rangeValue class', () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'range',
        showValue: true,
        rangeValueClass: ['custom-class']
      }
    })
    expect(wrapper.find('.formulate-input-element-range-value.custom-class').exists()).toBe(true)
  })
})
