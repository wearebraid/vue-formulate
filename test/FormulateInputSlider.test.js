import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../src/Formulate.js'
import FormulateInput from '../src/FormulateInput.vue'
import FormulateInputSlider from '../src/inputs/FormulateInputSlider.vue'

Vue.use(Formulate)

/**
 * Test each type of slider element
 */

describe('FormulateInputSlider', () => {
  it('renders range input when type is "range"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'range' } })
    expect(wrapper.contains(FormulateInputSlider)).toBe(true)
  })
})
