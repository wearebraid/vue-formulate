import Vue from 'vue'
import flushPromises from 'flush-promises'
import { mount, createLocalVue } from '@vue/test-utils'
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
    expect(wrapper.findComponent(FormulateInputBox).exists()).toBe(true)
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
    expect(errorObject).toEqual({
      name: 'testinput',
      errors: [
        expect.any(String)
      ],
      hasErrors: true
    })
  })

  it('emits a error-visibility event on blur', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required',
      errorBehavior: 'blur',
      value: '',
      name: 'testinput',
    } })
    await flushPromises()
    expect(wrapper.emitted('error-visibility')[0][0]).toBe(false)
    wrapper.find('input[type="text"]').trigger('blur')
    await flushPromises()
    expect(wrapper.emitted('error-visibility')[1][0]).toBe(true)
  })

  it('emits error-visibility event immediately when live', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required',
      errorBehavior: 'live',
      value: '',
      name: 'testinput',
    } })
    await flushPromises()
    expect(wrapper.emitted('error-visibility').length).toBe(1)
  })

  it('Does not emit an error-visibility event if visibility did not change', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'in:xyz',
      errorBehavior: 'live',
      value: 'bar',
      name: 'testinput',
    } })
    await flushPromises()
    expect(wrapper.emitted('error-visibility').length).toBe(1)
    wrapper.find('input[type="text"]').setValue('bar')
    await flushPromises()
    expect(wrapper.emitted('error-visibility').length).toBe(1)
  })

  it('allows overriding the label default slot component', async () => {
    const localVue = createLocalVue()
    localVue.component('CustomLabel', {
      render: function (h) {
        return h('div', { class: 'custom-label' }, [`custom: ${this.context.label}`])
      },
      props: ['context']
    })
    localVue.use(Formulate, { slotComponents: { label: 'CustomLabel' } })
    const wrapper = mount(FormulateInput, { localVue, propsData: { label: 'My label here' } })
    expect(wrapper.find('.custom-label').html()).toBe('<div class="custom-label">custom: My label here</div>')
  })

  it('allows overriding the help default slot component', async () => {
    const localVue = createLocalVue()
    localVue.component('CustomHelp', {
      render: function (h) {
        return h('small', { class: 'custom-help' }, [`custom: ${this.context.help}`])
      },
      props: ['context']
    })
    localVue.use(Formulate, { slotComponents: { help: 'CustomHelp' } })
    const wrapper = mount(FormulateInput, { localVue, propsData: { help: 'My help here' } })
    expect(wrapper.find('.custom-help').html()).toBe('<small class="custom-help">custom: My help here</small>')
  })

  it('allows overriding the errors component', async () => {
    const localVue = createLocalVue()
    localVue.component('CustomErrors', {
      render: function (h) {
        return h('ul', { class: 'my-errors' }, this.context.visibleValidationErrors.map(message => h('li', message)))
      },
      props: ['context']
    })
    localVue.use(Formulate, { slotComponents: { errors: 'CustomErrors' } })
    const wrapper = mount(FormulateInput, { localVue, propsData: {
      help: 'My help here',
      errorBehavior: 'live',
      validation: 'required'
    } })
    await flushPromises()
    expect(wrapper.find('.my-errors').html())
      .toBe(`<ul class="my-errors">\n  <li>Text is required.</li>\n</ul>`)
  })
})
