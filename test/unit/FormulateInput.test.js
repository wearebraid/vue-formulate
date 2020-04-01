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
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|in:abcdef',
        validationMessages: { in: 'the value was different than expected' },
        errorBehavior: 'live',
        value: 'other value'
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('the value was different than expected')
  })

  it('allows custom field-rule level validation functions', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|in:abcdef',
        validationMessages: { in: ({ value }) => `The string ${value} is not correct.` },
        errorBehavior: 'live',
        value: 'other value'
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('The string other value is not correct.')
  })

  it('uses globally overridden validation messages', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|email',
        errorBehavior: 'live',
        value: 'wrong email'
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('Super invalid email: wrong email')
  })

  it('uses custom async validation rules on defined on the field', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|foobar',
        validationMessages: {
          foobar: 'failed the foobar check'
        },
        validationRules: {
          foobar: async ({ value }) => value === 'foo'
        },
        validation: 'required|foobar',
        errorBehavior: 'live',
        value: 'bar'
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('failed the foobar check')
  })

  it('uses custom sync validation rules on defined on the field', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|foobar',
        validationMessages: {
          foobar: 'failed the foobar check'
        },
        validationRules: {
          foobar: ({ value }) => value === 'foo'
        },
        validation: 'required|foobar',
        errorBehavior: 'live',
        value: 'bar'
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').text()).toBe('failed the foobar check')
  })

  it('uses global custom validation rules', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'text',
        validation: 'required|globalRule',
        errorBehavior: 'live',
        value: 'bar'
      }
    })
    await flushPromises()
    expect(globalRule.mock.calls.length).toBe(1)
  })

  it('can extend its standard library of inputs', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'special',
        validation: 'required',
        errorBehavior: 'live',
        value: 'bar'
      }
    })
    await flushPromises()
    expect(wrapper.contains(FormulateInputBox)).toBe(true)
  })

  describe('Attributes', () => {
    it('links help text with `aria-describedby`', async () => {
      const wrapper = mount(FormulateInput, {
        propsData: {
          type: 'text',
          validation: 'required|globalRule',
          errorBehavior: 'live',
          value: 'bar',
          help: 'Some help text'
        }
      })

      await flushPromises()

      const text = wrapper.find('[data-test="formulate-input-text"]')
      const help = wrapper.find('[data-test="formulate-input-help"]')
      const helpId = help.attributes('id')

      expect(text.attributes('aria-describedby')).toBe(helpId);
    });

    it('links errors with `aria-describedby`', async () => {
      const wrapper = mount(FormulateInput, {
        propsData: {
          type: 'text',
          validation: 'required|globalRule',
          errorBehavior: 'live',
          value: 'bar',
          help: 'Some help text'
        }
      })

      await flushPromises()

      const text = wrapper.find('[data-test="formulate-input-text"]')
      const errors = wrapper.find('[data-test="formulate-errors"]')
      const errorsId = errors.attributes('id')

      expect(text.attributes('aria-describedby')).toBe(errorsId);
    });
  });
})
