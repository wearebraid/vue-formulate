import Vue from 'vue'
import flushPromises from 'flush-promises'
import { mount } from '@vue/test-utils'
import Formulate from '@/Formulate.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputBox from '@/inputs/FormulateInputBox.vue'

const globalRule = jest.fn((context) => { return false })

Vue.use(Formulate, {
  locales: {
    en: {
      email: ({ value }) => `Super invalid email: ${value}`
    }
  },
  rules: {
    globalRule
  },
  library: {
    special: {
      classification: 'box',
      component: 'FormulateInputBox'
    }
  }
})

describe('FormulateInput', () => {
  it('allows custom field-rule level validation strings', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|in:abcdef',
      validationMessages: {in: 'the value was different than expected'},
      errorBehavior: 'live',
      value: 'other value'
    } })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('the value was different than expected')
  })

  it('allows custom field-rule level validation functions', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|in:abcdef',
      validationMessages: { in: ({ value }) => `The string ${value} is not correct.` },
      errorBehavior: 'live',
      value: 'other value'
    } })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('The string other value is not correct.')
  })

  it('uses globally overridden validation messages', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|email',
      errorBehavior: 'live',
      value: 'wrong email'
    } })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('Super invalid email: wrong email')
  })

  it('uses custom async validation rules on defined on the field', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|foobar',
      validationMessages: {
        foobar: 'failed the foobar check'
      },
      validationRules: {
        foobar: async ({ value }) => value === 'foo'
      },
      errorBehavior: 'live',
      value: 'bar'
    } })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('failed the foobar check')
  })

  it('uses custom sync validation rules on defined on the field', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|foobar',
      validationMessages: {
        foobar: 'failed the foobar check'
      },
      validationRules: {
        foobar: ({ value }) => value === 'foo'
      },
      errorBehavior: 'live',
      value: 'bar'
    } })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('failed the foobar check')
  })

  it('uses global custom validation rules', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required|globalRule',
      errorBehavior: 'live',
      value: 'bar'
    } })
    await flushPromises()
    expect(globalRule.mock.calls.length).toBe(1)
  })

  it('can extend its standard library of inputs', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'special',
      validation: 'required',
      errorBehavior: 'live',
      value: 'bar'
    } })
    await flushPromises()
    expect(wrapper.contains(FormulateInputBox)).toBe(true)
  })
  it('emits correct validation event', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
        type: 'text',
        validation: 'required',
        errorBehavior: 'live',
        value: '',
        name: 'testinput',
      } })
    await flushPromises()
    const errorObject = wrapper.emitted('validation')[0][0]
    expect(errorObject).toEqual(expect.objectContaining({
      name: 'testinput',
      errors: [
        expect.any(String)
      ],
      hasErrors: true
    }))
  })

  it('doesn’t emit a validation event if the validation state didn’t change', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
        type: 'text',
        validation: 'min:5',
        errorBehavior: 'live',
        value: '',
        name: 'testinput',
      } })
    await flushPromises()
    expect(wrapper.emitted('validation').length).toBe(1)
    wrapper.find('input').setValue('foo')
    await flushPromises()
    wrapper.find('input').setValue('')
    await flushPromises()
    expect(wrapper.emitted('validation').length).toBe(1)
  })
})
