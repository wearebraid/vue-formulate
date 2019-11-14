import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Formulate from '../src/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputText from '@/inputs/FormulateInputText.vue'
import { doesNotReject } from 'assert';

Vue.use(Formulate)

/**
 * Test each type of text element
 */

describe('FormulateInputText', () => {
  it('renders text input when type is "text"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders search input when type is "search"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'search' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders email input when type is "email"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'email' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders number input when type is "number"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'number' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders color input when type is "color"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'color' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders date input when type is "date"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'date' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders month input when type is "month"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'month' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders password input when type is "password"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'password' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders tel input when type is "tel"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'tel' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders time input when type is "time"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'time' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders url input when type is "url"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'url' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  it('renders week input when type is "week"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'week' } })
    expect(wrapper.contains(FormulateInputText)).toBe(true)
  })

  /**
   * Test rendering functionality to text inputs
   */

  it('automatically assigns an id', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    expect(wrapper.vm.context).toHaveProperty('id')
    expect(wrapper.find(`input[id="${wrapper.vm.context.attributes.id}"]`).exists()).toBe(true)
  })

  it('doesn’t automatically add a label', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders labels', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', label: 'Field label' } })
    expect(wrapper.find(`label[for="${wrapper.vm.context.attributes.id}"]`).exists()).toBe(true)
  })

  it('doesn’t automatically render help text', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    expect(wrapper.find(`.formulate-input-help`).exists()).toBe(false)
  })

  it('renders help text', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', help: 'This is some help text' } })
    expect(wrapper.find(`.formulate-input-help`).exists()).toBe(true)
  })

  /**
   * Test data binding
   */
  it('emits input (vmodel) event with value when edited', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    wrapper.find('input').setValue('Updated Value')
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input[0]).toEqual(['Updated Value'])
  })


  it('doesn’t re-context itself if there were no changes', () => {
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

  it('uses the v-model value as the initial value', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', formulateValue: 'initial val' } })
    expect(wrapper.find('input').element.value).toBe('initial val')
  })

  it('uses a proxy model internally if it doesnt have a v-model', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'textarea' } })
    const input = wrapper.find('textarea')
    input.setValue('changed value')
    expect(wrapper.vm.internalModelProxy).toBe('changed value')
  })


  /**
   * Test error handling
   */
  it('doesn’t automatically render errors', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' } })
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(false)
  })

  it('accepts a single string as an error prop', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'live', error: 'This is an error' } })
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(true)
  })

  it('accepts an array as errors prop', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'live', errors: ['This is an error', 'this is another'] } })
    expect(wrapper.findAll('.formulate-input-error').length).toBe(2)
  })

  it('removes any duplicate errors', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'live', errors: ['This is an error', 'This is an error'] } })
    expect(wrapper.findAll('.formulate-input-error').length).toBe(1)
  })

  it('adds data-has-errors when there are errors', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'live', errors: ['This is an error', 'This is an error'] } })
    expect(wrapper.find('[data-has-errors]').exists()).toBe(true)
  })

  it('does not initially show error-behavior blur errors', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'blur', errors: ['Bad input'] } })
    expect(wrapper.find('[data-has-errors]').exists()).toBe(true)
    expect(wrapper.find('[data-is-showing-errors]').exists()).toBe(false)
    expect(wrapper.findAll('.formulate-input-errors').exists()).toBe(false)
  })


  it('allows error-behavior blur to be overridden with show-errors', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'blur', showErrors: true, errors: ['Bad input'] } })
    expect(wrapper.find('[data-has-errors]').exists()).toBe(true)
    expect(wrapper.find('[data-is-showing-errors]').exists()).toBe(true)
    expect(wrapper.findAll('.formulate-input-errors').exists()).toBe(true)
    expect(wrapper.findAll('.formulate-input-error').length).toBe(1)
  })

  it('shows errors on blur with error-behavior blur', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text', errorBehavior: 'blur', errors: ['Bad input'] } })
    expect(wrapper.find('[data-has-errors]').exists()).toBe(true)
    expect(wrapper.find('[data-is-showing-errors]').exists()).toBe(false)
    expect(wrapper.findAll('.formulate-input-errors').exists()).toBe(false)
    wrapper.find('input').trigger('blur')
    expect(wrapper.find('[data-is-showing-errors]').exists()).toBe(true)
    expect(wrapper.findAll('.formulate-input-errors').exists()).toBe(true)
    expect(wrapper.findAll('.formulate-input-error').length).toBe(1)
  })
})
