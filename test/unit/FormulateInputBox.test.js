import Vue from 'vue'
import flushPromises from 'flush-promises'
import { mount } from '@vue/test-utils'
import Formulate from '../../src/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputBox from '@/inputs/FormulateInputBox.vue'
import FormulateInputGroup from '@/FormulateInputGroup.vue'

Vue.use(Formulate)

describe('FormulateInputBox', () => {
  it('renders a box element when type "checkbox" ', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox' } })
    expect(wrapper.contains(FormulateInputBox)).toBe(true)
  })

  it('renders a box element when type "radio"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio' } })
    expect(wrapper.contains(FormulateInputBox)).toBe(true)
  })

  it('box inputs properly process options object in context library', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'} } })
    expect(Array.isArray(wrapper.vm.context.options)).toBe(true)
  })

  it('renders a group when type "checkbox" with options', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'} } })
    expect(wrapper.contains(FormulateInputGroup)).toBe(true)
  })

  it('renders a group when type "radio" with options', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
    expect(wrapper.contains(FormulateInputGroup)).toBe(true)
  })

  it('defaults labelPosition to "after" when type "checkbox"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox' } })
    expect(wrapper.vm.context.labelPosition).toBe('after')
  })

  it('labelPosition of defaults to before when type "checkbox" with options', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'}}})
    expect(wrapper.vm.context.labelPosition).toBe('before')
  })


  it('renders multiple inputs with options when type "radio"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(2)
  })

  it('generates ids if not provided when type "radio"', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
    expect(wrapper.findAll('input[type="radio"]').is('[id]')).toBe(true)
  })

  it('additional context does not bleed through to attributes with type "radio" and options', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'} } })
    expect(Object.keys(wrapper.find('input[type="radio"]').attributes())).toEqual(["type", "id", "value"])
  })

  it('additional context does not bleed through to attributes with type "checkbox" and options', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2'} } })
    expect(Object.keys(wrapper.find('input[type="checkbox"]').attributes())).toEqual(["type", "id", "value"])
  })

  it('allows external attributes to make it down to the inner box elements', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'}, readonly: 'true' } })
    expect(Object.keys(wrapper.find('input[type="radio"]').attributes()).includes('readonly')).toBe(true)
  })

  it('does not use the value attribute to be checked', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', value: '123' } })
    expect(wrapper.find('input').is(':checked')).toBe(false)
  })

  it('uses the checked attribute to be checked', async () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', checked: 'true' } })
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').is(':checked')).toBe(true)
  })

  it('uses the value attribute to select "type" radio when using options', async () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'radio', options: {a: '1', b: '2'}, value: 'b' } })
    await flushPromises()
    expect(wrapper.findAll('input:checked').length).toBe(1)
  })

  it('uses the value attribute to select "type" checkbox when using options', async () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: {a: '1', b: '2', c: '123'}, value: ['b', 'c'] } })
    await flushPromises()
    expect(wrapper.findAll('input:checked').length).toBe(2)
  })

  /**
   * it data binding
   */

  it('sets array of values via v-model when type "checkbox"', async () => {
    const wrapper = mount({
      data () {
        return {
          checkboxValues: [],
          options: {foo: 'Foo', bar: 'Bar', fooey: 'Fooey'}
        }
      },
      template: `
        <div>
          <FormulateInput type="checkbox" v-model="checkboxValues" :options="options" />
        </div>
      `
    })
    const fooInputs = wrapper.findAll('input[value^="foo"]')
    expect(fooInputs.length).toBe(2)
    fooInputs.at(0).setChecked()
    await flushPromises()
    fooInputs.at(1).setChecked()
    await flushPromises()
    expect(wrapper.vm.checkboxValues).toEqual(['foo', 'fooey'])
  })

  it('does not pre-set internal value when type "radio" with options', async () => {
    const wrapper = mount({
      data () {
        return {
          radioValue: '',
          options: {foo: 'Foo', bar: 'Bar', fooey: 'Fooey'}
        }
      },
      template: `
        <div>
          <FormulateInput type="radio" v-model="radioValue" :options="options" />
        </div>
      `
    })
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.vm.radioValue).toBe('')
  })

  it('does not pre-set internal value of FormulateForm when type "radio" with options', async () => {
    const wrapper = mount({
      data () {
        return {
          radioValue: '',
          formValues: {},
          options: {foo: 'Foo', bar: 'Bar', fooey: 'Fooey'}
        }
      },
      template: `
        <FormulateForm
          v-model="formValues"
        >
          <FormulateInput type="radio" v-model="radioValue" name="foobar" :options="options" />
        </FormulateForm>
      `
    })
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.vm.formValues.foobar).toBe('')
  })

  it('does precheck the correct input when radio with options', async () => {
    const wrapper = mount({
      data () {
        return {
          radioValue: 'fooey',
          options: {foo: 'Foo', bar: 'Bar', fooey: 'Fooey', gooey: 'Gooey'}
        }
      },
      template: `
        <div>
          <FormulateInput type="radio" v-model="radioValue" :options="options" />
        </div>
      `
    })
    await flushPromises()
    const checkboxes = wrapper.findAll('input[type="radio"]:checked')
    expect(checkboxes.length).toBe(1)
    expect(checkboxes.at(0).element.value).toBe('fooey')
  })

  it('shows validation errors when blurred', async () => {
    const wrapper = mount({
      data () {
        return {
          radioValue: 'fooey',
          options: {foo: 'Foo', bar: 'Bar', fooey: 'Fooey', gooey: 'Gooey'}
        }
      },
      template: `
        <div>
          <FormulateInput type="radio" v-model="radioValue" :options="options" validation="in:gooey" />
        </div>
      `
    })
    wrapper.find('input[value="fooey"]').trigger('blur')
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').exists()).toBe(true)
  })

  it('renders no boxes when options array is empty', async () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'checkbox', options: [] } })
    expect(wrapper.contains(FormulateInputGroup)).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
  })
})
