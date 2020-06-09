import Vue from 'vue'
import flushPromises from 'flush-promises'
import { mount, createLocalVue } from '@vue/test-utils'
import Formulate from '@/Formulate.js'
import FormulateForm from '@/FormulateForm.vue'
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
    // Clean up after this call — we should probably get rid of the singleton all together....
    Formulate.extend({ slotComponents: { errors: 'FormulateErrors' }})
  })

  it('links help text with `aria-describedby`', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required',
        errorBehavior: 'live',
        value: 'bar',
        help: 'Some help text'
      }
    })
    await flushPromises()
    const id = `${wrapper.vm.context.id}-help`
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(id)
    expect(wrapper.find('.formulate-input-help').attributes().id).toBe(id)
  });

  it('it does not use aria-describedby if there is no help text', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required',
        errorBehavior: 'live',
        value: 'bar',
      }
    })
    await flushPromises()
    expect(wrapper.find('input').attributes('aria-describedby')).toBeFalsy()
  });

  it('can bail on validation when encountering the bail rule', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text', validation: 'bail|required|in:xyz', errorBehavior: 'live' }
    })
    await flushPromises();
    expect(wrapper.vm.context.visibleValidationErrors.length).toBe(1);
  })

  it('can show multiple validation errors if they occur before the bail rule', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text', validation: 'required|in:xyz|bail', errorBehavior: 'live' }
    })
    await flushPromises();
    expect(wrapper.vm.context.visibleValidationErrors.length).toBe(2);
  })

  it('can avoid bail behavior by using modifier', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text', validation: '^required|in:xyz|min:10,length', errorBehavior: 'live', value: '123' }
    })
    await flushPromises();
    expect(wrapper.vm.context.visibleValidationErrors.length).toBe(2);
  })

  it('prevents later error messages when modified rule fails', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text', validation: '^required|in:xyz|min:10,length', errorBehavior: 'live' }
    })
    await flushPromises();
    expect(wrapper.vm.context.visibleValidationErrors.length).toBe(1);
  })

  it('can bail in the middle of the rule set with a modifier', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text', validation: 'required|^in:xyz|min:10,length', errorBehavior: 'live' }
    })
    await flushPromises();
    expect(wrapper.vm.context.visibleValidationErrors.length).toBe(2);
  })

  it('does not show errors on blur when set error-behavior is submit', async () => {
    const wrapper = mount(FormulateInput, { propsData: {
      type: 'text',
      validation: 'required',
      errorBehavior: 'submit',
    } })
    wrapper.find('input').trigger('input')
    wrapper.find('input').trigger('blur')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(false)
  })

  it('displays errors when error-behavior is submit and form is submitted', async () => {
    const wrapper = mount(FormulateForm, {
      slots: {
        default: `<FormulateInput error-behavior="submit" validation="required" />`
      }
    })
    wrapper.trigger('submit')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(true)
  })

  it('passes $emit to rootEmit inside the context object', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'text' }
    })
    wrapper.vm.context.rootEmit('foo', 'bar')
    await flushPromises()
    expect(wrapper.emitted().foo[0]).toEqual(['bar'])
  })

  it('allows getFormValues inside of custom validation messages', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput type="text" name="first" />
          <FormulateInput type="text"  name="last" />
          <FormulateInput
            type="text"
            name="name"
            validation="fullName"
            :validation-rules="{ fullName }"
            :validation-messages="{ fullName: fullNameMessage }"
            error-behavior="live"
          />
        </FormulateForm>
      `,
      methods: {
        fullName ({ value, getFormValues }) {
          const values = getFormValues()
          return `${values.first} ${values.last}` === value
        },
        fullNameMessage ({ value, formValues }) {
          return `${formValues.first} ${formValues.last} does not equal ${value}.`
        }
      }
    })
    await flushPromises()
    const inputs = wrapper.findAll('input[type="text"]')
    inputs.at(0).setValue('jon')
    inputs.at(1).setValue('baley')
    inputs.at(2).setValue('jon baley')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(false)
    inputs.at(1).setValue('parker')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(true)
    expect(wrapper.find('.formulate-input-errors li').text()).toBe('jon parker does not equal jon baley.')
  })

  it('emits an input event a single time on change', async () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'text' }})
    await flushPromises()
    wrapper.find('input').setValue('a')
    await flushPromises()
    expect(wrapper.emitted().input.length).toBe(1);
  })
})
