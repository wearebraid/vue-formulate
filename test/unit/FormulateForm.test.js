import { mount as mountWithoutFormulate } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '../../src/Formulate.js'
import FormSubmission from '../../src/FormSubmission.js'
import FormulateForm from '@/FormulateForm.vue'
import FormulateInput from '@/FormulateInput.vue'

const mount = (app, options) => {
  const withPlugin = {
    global: {
      plugins: [Formulate],
    },
  }
  return mountWithoutFormulate(app, { ...options, ...withPlugin } )
}

describe('FormulateForm', () => {
  it('render a form DOM element', () => {
    const wrapper = mount(FormulateForm)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('accepts a default slot', () => {
    const wrapper = mount(FormulateForm, {
      slots: {
        default: '<div class="default-slot-item" />'
      }
    })
    expect(wrapper.find('form div.default-slot-item').exists()).toBe(true)
  })

  it('intercepts submit event', async () => {
    const wrapper = mount(FormulateForm, {
      slots: {
        default: "<button type='submit' />"
      }
    })
    wrapper.vm.formSubmitted = jest.fn()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.vm.formSubmitted).toHaveBeenCalled()
  })

  it('registers its subcomponents', () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { testinput: 'has initial value' } },
      slots: { default: '<FormulateInput type="text" name="subinput1" /><FormulateInput type="checkbox" name="subinput2" />' }
    })
    expect(wrapper.vm.registry.keys()).toEqual(['subinput1', 'subinput2'])
  })

  // Skipped until replacement for `setData` is found in vue-test-utils-next
  it.skip('deregisters a subcomponents', async () => {
    const wrapper = mount({
      data () {
        return {
          active: true
        }
      },
      template: `
        <FormulateForm>
          <FormulateInput v-if="active" type="text" name="subinput1" />
          <FormulateInput type="checkbox" name="subinput2" />
        </FormulateForm>
      `
    })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.registry.keys()).toEqual(['subinput1', 'subinput2'])
    wrapper.setData({ active: false })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.registry.keys()).toEqual(['subinput2'])
  })

  it('can set a field’s initial value', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { testinput: 'has initial value' } },
      slots: { default: '<FormulateInput type="text" name="testinput" />' }
    })
    await flushPromises()
    expect(wrapper.find('input').element.value).toBe('has initial value')
  })

  it('lets individual fields override form initial value', () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { testinput: 'has initial value' } },
      slots: { default: '<FormulateInput type="text" formulate-value="123" name="testinput" />' }
    })
    expect(wrapper.find('input').element.value).toBe('123')
  })

  it('lets fields set form initial value with value prop', () => {
    const wrapper = mount({
      data () {
        return {
          formValues: {}
        }
      },
      template: `<FormulateForm v-model="formValues">
        <FormulateInput name="name" modelValue="123" />
      </FormulateForm>`
    })
    expect(wrapper.vm.formValues).toEqual({ name: '123' })
  })

  it('can set initial checked attribute on single checkboxes', () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { box1: true } },
      slots: { default: '<FormulateInput type="checkbox" name="box1" />' }
    })
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBeTruthy()
  });

  it('can set initial unchecked attribute on single checkboxes', () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { box1: false } },
      slots: { default: '<FormulateInput type="checkbox" name="box1" />' }
    })
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBeFalsy()
  });

  it('can set checkbox initial value with options', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { box2: ['second', 'third'] } },
      slots: { default: '<FormulateInput type="checkbox" name="box2" :options="{first: \'First\', second: \'Second\', third: \'Third\'}" />' }
    })
    await flushPromises()
    expect(wrapper.findAll('input').length).toBe(3)
  });

  it('receives updates to form model when individual fields are edited', () => {
    const wrapper = mount({
      data () {
        return {
          formValues: {
            testinput: '',
          }
        }
      },
      template: `
        <FormulateForm v-model="formValues">
          <FormulateInput type="text" name="testinput" />
        </FormulateForm>
      `
    })
    wrapper.find('input').setValue('edited value')
    expect(wrapper.vm.formValues).toEqual({ testinput: 'edited value' })
  })

  it('updates initial form values when input contains a populated v-model', async () => {
    const wrapper = mount({
      data () {
        return {
          formValues: {
            testinput: '',
          },
          fieldValue: '123'
        }
      },
      template: `
        <FormulateForm v-model="formValues">
          <FormulateInput type="text" name="testinput" v-model="fieldValue" />
        </FormulateForm>
      `
    })
    await flushPromises()
    expect(wrapper.vm.formValues).toEqual({ testinput: '123' })
  })

  it.skip('updates an inputs value when the form v-model is modified', async () => {
    const wrapper = mount({
      data () {
        return {
          formValues: {
            testinput: 'abcd',
          }
        }
      },
      template: `
        <FormulateForm v-model="formValues">
          <FormulateInput type="text" name="testinput" />
        </FormulateForm>
      `
    })
    await flushPromises()
    wrapper.vm.formValues = { testinput: '1234' }
    await flushPromises()
    expect(wrapper.find('input[type="text"]').element.value).toBe('1234')
  })

  it.skip('updates all inputs (even when not used in a field) when the v-model is modified', async () => {
    const wrapper = mount({
      data () {
        return {
          formValues: {
            testinputA: 'A',
            testinputB: 'B',
            extraProp: 'C'
          }
        }
      },
      template: `
        <div>
          <FormulateForm v-model="formValues">
            <FormulateInput ref="inputA" type="text" name="testinputA" />
          </FormulateForm>
          <FormulateForm v-model="formValues">
            <FormulateInput ref="inputB" type="text" name="testinputB" />
          </FormulateForm>
        </div>
      `
    })
    await flushPromises()
    wrapper.vm.formValues.testinputA = 'updatedA'
    wrapper.vm.formValues.testinputB = 'updatedB'
    await flushPromises()
    expect(wrapper.findAll('input[type="text"]').at(0).element.value).toBe('updatedA')
    expect(wrapper.findAll('input[type="text"]').at(1).element.value).toBe('updatedB')
    expect(wrapper.vm.formValues.testinputA).toBe('updatedA')
    expect(wrapper.vm.formValues.testinputB).toBe('updatedB')
    expect(wrapper.vm.formValues.extraProp).toBe('C')
  })

  it.skip('emits an instance of FormSubmission', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" formulate-value="123" name="testinput" />' }
    })
    wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.emitted('submit-raw')[0][0]).toBeInstanceOf(FormSubmission)
  })

  it.skip('resolves hasValidationErrors to true', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" validation="required" name="testinput" />' }
    })
    wrapper.find('form').trigger('submit')
    await flushPromises()
    const submission = wrapper.emitted('submit-raw')[0][0]
    expect(await submission.hasValidationErrors()).toBe(true)
  })

  it.skip('resolves submitted form values to an object', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" validation="required" name="testinput" value="Justin" />' }
    })
    const submission = await wrapper.vm.formSubmitted()
    expect(submission).toEqual({testinput: 'Justin'})
  })

  it.skip('accepts a values prop and uses it to set the initial values', async () => {
    const wrapper = mount(FormulateForm, {
      props: { values: { name: 'Dave Barnett', candy: true } },
      slots: { default: `<FormulateInput type="text" name="name" validation="required" /><FormulateInput type="checkbox" name="candy" />` }
    })
    await flushPromises()
    expect(wrapper.find('input[type="text"]').element.value).toBe('Dave Barnett')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })

  it.skip('shows error messages when it includes a checkbox with options', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { box3: [] } },
      slots: { default: '<FormulateInput type="checkbox" name="box3" validation="required" :options="{first: \'First\', second: \'Second\', third: \'Third\'}" />' }
    })
    wrapper.trigger('submit')
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').exists()).toBe(true)
  })

  it.skip('automatically registers with root plugin', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formulateValue: { box3: [] }, name: 'login' }
    })
    expect(wrapper.vm.$formulate.registry.has('login')).toBe(true)
    expect(wrapper.vm.$formulate.registry.get('login')).toBe(wrapper.vm)
  })

  it.skip('calls custom error handler with error and name', async () => {
    const mockHandler = jest.fn((err, name) => err);
    const wrapper = mount({
      template: `
      <div>
        <FormulateForm
          name="login"
        />
        <FormulateForm
          name="register"
        />
      </div>
      `
    })
    wrapper.vm.$formulate.extend({ errorHandler: mockHandler })
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message'] }, 'login')
    expect(mockHandler.mock.calls.length).toBe(1);
    expect(mockHandler.mock.calls[0]).toEqual([{ formErrors: ['This is an error message'] }, 'login']);
  })

  it.skip('errors are displayed on correctly named forms', async () => {
    const wrapper = mount({
      template: `
      <div>
        <FormulateForm
          name="login"
        />
        <FormulateForm
          name="register"
        />
      </div>
      `
    })
    expect(wrapper.vm.$formulate.registry.has('login') && wrapper.vm.$formulate.registry.has('register')).toBe(true)
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form').length).toBe(2)
    expect(wrapper.find('.formulate-form--login .formulate-form-errors').exists()).toBe(true)
    expect(wrapper.find('.formulate-form--register .formulate-form-errors').exists()).toBe(false)
  })

  it.skip('errors are displayed on correctly named forms', async () => {
    const wrapper = mount({
      template: `
      <div>
        <FormulateForm
          name="login"
        />
        <FormulateForm
          name="register"
        />
      </div>
      `
    })
    expect(wrapper.vm.$formulate.registry.has('login') && wrapper.vm.$formulate.registry.has('register')).toBe(true)
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form').length).toBe(2)
    expect(wrapper.find('.formulate-form--login .formulate-form-errors').exists()).toBe(true)
    expect(wrapper.find('.formulate-form--register .formulate-form-errors').exists()).toBe(false)
  })

  it.skip('de-registers named forms when destroyed', async () => {
    const wrapper = mount({
      template: `
      <div>
        <FormulateForm
          name="login"
          v-if="hasForm"
        />
        <FormulateForm
          name="register"
        />
      </div>
      `,
      data () {
        return {
          hasForm: true
        }
      }
    })
    await flushPromises()
    expect(wrapper.vm.$formulate.registry.has('login')).toBe(true)
    wrapper.vm.hasForm = false
    await flushPromises()
    expect(wrapper.vm.$formulate.registry.has('login')).toBe(false)
  })

  it.skip('hides root FormError if another form error exists and renders in new location', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          name="login"
        >
          <h1>Login</h1>
          <FormulateErrors />
          <FormulateInput name="username" validation="required" error-behavior="live" />
        </FormulateForm>
      `
    })
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-errors').length).toBe(1)
    // Ensure that we moved the position of the errors
    expect(wrapper.find('h1 + *').element.classList.contains('formulate-form-errors')).toBe(true)
  })

  it.skip('allows rendering multiple locations', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          name="login"
        >
          <h1>Login</h1>
          <FormulateErrors />
          <FormulateInput name="username" validation="required" error-behavior="live" />
          <FormulateErrors />
        </FormulateForm>
      `
    })
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-errors').length).toBe(2)
  })

  it.skip('receives a form-errors prop and displays it', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formErrors: ['first', 'second'] },
      slots: {
        default: '<FormulateInput name="name" />'
      }
    })
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-error').length).toBe(2)
  })

  it.skip('it aggregates form-errors prop with form-named errors', async () => {
    const wrapper = mount(FormulateForm, {
      props: { formErrors: ['first', 'second'], name: 'login' }
    })
    wrapper.vm.$formulate.handle({ formErrors: ['third'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-error').length).toBe(3)
  })

  it.skip('displays field errors on inputs with errors prop', async () => {
    const wrapper = mount(FormulateForm, {
      props: { errors: { sipple: ['This field has an error'] }},
      slots: {
        default: '<FormulateInput name="sipple" />'
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.formulate-input .formulate-input-error').exists()).toBe(true)
  })

  it.skip('is able to display multiple errors on multiple elements', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          :errors="{inputA: ['first', 'second'], inputB: 'only one here', inputC: ['and one here']}"
        >
          <FormulateInput name="inputA" />
          <FormulateInput name="inputB" type="textarea" />
          <FormulateInput name="inputC" type="checkbox" />
        </FormulateForm>
        `
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.formulate-input-error').length).toBe(4)
  })

  it.skip('it can set multiple field errors with handle()', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm name="register">
          <FormulateInput name="inputA" />
          <FormulateInput name="inputB" type="textarea" />
          <FormulateInput name="inputC" type="checkbox" />
        </FormulateForm>
        `
    })
    expect(wrapper.findAll('.formulate-input-error').length).toBe(0)
    wrapper.vm.$formulate.handle({ inputErrors: {inputA: ['first', 'second'], inputB: 'only one here', inputC: ['and one here']} }, "register")
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.findAll('.formulate-input-error').length).toBe(4)
  })

  it.skip('only sets 1 error when used on a FormulateGroup input', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          name="register"
          :errors="{order: 'this didnt work'}"
        >
          <FormulateInput name="order" type="checkbox" :options="{first: 'First', last: 'Last', middle: 'Middle'}" />
        </FormulateForm>
        `
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.formulate-input-error').length).toBe(1)
  })

  it.skip('properly de-registers an observer when removed', async () => {
    const wrapper = mount({
      data () {
        return {
          hasField: true
        }
      },
      template: `
        <FormulateForm
          name="register"
          :errors="{order: 'this didnt work'}"
        >
          <FormulateInput v-if="hasField" name="order" type="checkbox" :options="{first: 'First', last: 'Last', middle: 'Middle'}" />
        </FormulateForm>
        `
    })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.errorObservers.length).toBe(1)
    wrapper.setData({ hasField: false })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.errorObservers.length).toBe(0)
  })

  it.skip('emits correct validation event on entry', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: `
        <div>
          <FormulateInput type="text" validation="required|in:bar" name="testinput" />
          <FormulateInput type="radio" validation="required" name="bar" />
        </div>
      ` }
    })
    wrapper.find('input[type="text"]').setValue('foo')
    await flushPromises()
    const errorObjects = wrapper.emitted('validation')
    // There should be 3 events, both inputs mounting, and the value being set removing required on testinput
    expect(errorObjects.length).toBe(3)
    // this should be the event from the setValue()
    const errorObject = errorObjects[2][0]
    expect(errorObject).toEqual({
      name: 'testinput',
      errors: [
        expect.any(String)
      ],
      hasErrors: true
    })
  })

  it.skip('emits correct validation event when no errors', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: `
        <div>
          <FormulateInput type="text" validation="required|in:bar" name="testinput" />
          <FormulateInput type="radio" validation="required" name="bar" />
        </div>
      ` }
    })
    wrapper.find('input[type="text"]').setValue('bar')
    await flushPromises()
    const errorObjects = wrapper.emitted('validation')
    expect(errorObjects.length).toBe(3)
    const errorObject = errorObjects[2][0]
    expect(errorObject).toEqual({
      name: 'testinput',
      errors: [],
      hasErrors: false
    })
  })

  it.skip('sets role="alert" attribute for form errors', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          name="login"
        />
      `
    })
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message', 'one more'] }, 'login')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="alert"]').length).toBe(2)
  })

  it.skip('sets aria-live="assertive" attribute for form errors', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          name="register"
        />
      `
    })
    wrapper.vm.$formulate.handle({ formErrors: ['This is an error message', 'one more', 'one more again'] }, 'register')
    await flushPromises()
    expect(wrapper.find('[aria-live="assertive"]').exists()).toBe(true)
    expect(wrapper.findAll('[aria-live="assertive"]').length).toBe(3)
  })

  it.skip('removes field data when that field is de-registered', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
        >
          <FormulateInput type="text" name="foo" value="abc123" />
          <FormulateInput type="checkbox" name="bar" v-if="formData.foo !== 'bar'" :value="1" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {}
        }
      }
    })
    await flushPromises()
    wrapper.find('input[type="text"]').setValue('bar')
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.proxy).toEqual({ foo: 'bar' })
    expect(wrapper.vm.formData).toEqual({ foo: 'bar' })
  })

  it.skip('it allows the removal of properties in proxy.', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
          name="login"
          ref="form"
        >
          <FormulateInput type="text" name="username" validation="required" v-model="username" />
          <FormulateInput type="password" name="password" validation="required|min:4,length" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {},
          username: undefined
        }
      }
    })
    wrapper.find('input[type="text"]').setValue('foo')
    await flushPromises()
    expect(wrapper.vm.username).toEqual('foo')
    expect(wrapper.vm.formData).toEqual({ username: 'foo' })
    wrapper.vm.$refs.form.setValues({})
    await flushPromises()
    expect(wrapper.vm.formData).toEqual({ username: '' })
  })

  it.skip('it allows resetting a form, hiding validation and clearing inputs.', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
          name="login"
        >
          <FormulateInput type="text" name="username" validation="required" />
          <FormulateInput type="password" name="password" validation="required|min:4,length" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {}
        }
      }
    })
    const password = wrapper.find('input[type="password"]')
    password.setValue('foo')
    password.trigger('blur')
    wrapper.find('form').trigger('submit')
    wrapper.vm.$formulate.handle({
      inputErrors: { username: ['Failed'] }
    }, 'login')
    await flushPromises()
    // First make sure we showed the errors
    expect(wrapper.findAll('.formulate-input-error').length).toBe(3)
    wrapper.vm.$formulate.reset('login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-input-error').length).toBe(0)
    expect(wrapper.vm.formData).toEqual({})
  })

  it.skip('re-validates dependent fields used in validation context', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
          name="login"
        >
          <FormulateInput type="password" name="password" error-behavior="live" />
          <FormulateInput type="password" name="password_confirm" validation="confirm" error-behavior="live" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {
            password: 'foobar',
            password_confirm: 'foobar'
          }
        }
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(false)
    const passwords = wrapper.findAll('input[type="password"]')
    passwords.at(1).setValue('123')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(true)
    passwords.at(0).setValue('123')
    await flushPromises()
    expect(wrapper.find('.formulate-input-errors').exists()).toBe(false)
  })

  it.skip('gracefully removes dependent fields when removed', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
          name="login"
        >
          <FormulateInput type="password" name="password" error-behavior="live" />
          <FormulateInput type="password" name="password_confirm" validation="confirm" error-behavior="live" v-if="hasConfirm"/>
        </FormulateForm>
      `,
      data () {
        return {
          hasConfirm: true,
          formData: {
            password: 'foobar',
            password_confirm: 'foobar'
          }
        }
      }
    })
    await flushPromises()
    var inputs = wrapper.findAllComponents(FormulateInput)
    expect(wrapper.findComponent(FormulateForm).vm.deps.get(inputs.at(0).vm)).toEqual(new Set(['password_confirm']))
    expect(wrapper.findComponent(FormulateForm).vm.deps.get(inputs.at(1).vm)).toEqual(new Set(['password']))
    wrapper.vm.hasConfirm = false
    await flushPromises();
    inputs = wrapper.findAllComponents(FormulateInput)
    expect(inputs.length).toBe(1)
    expect(wrapper.findComponent(FormulateForm).vm.deps.get(inputs.at(0).vm)).toEqual(new Set([]))
  })

  it.skip('allows form submission via named form', async () => {
    const submit = jest.fn()
    const wrapper = mount({
      template: `
        <FormulateForm
          name="password"
          @submit="submit"
        >
          <FormulateInput type="password" name="password"/>
          <FormulateInput type="password" name="password_confirm"/>
        </FormulateForm>
      `,
      data () {
        return {
          hasConfirm: true,
          formData: {
            password: 'foobar',
            password_confirm: 'foobar'
          }
        }
      },
      methods: {
        submit
      }
    })
    await flushPromises()
    wrapper.vm.$formulate.submit('password')
    await flushPromises()
    expect(submit.mock.calls.length).toBe(1)
  })

  it.skip('fires the input event after the model has been updated', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
        >
          <FormulateInput name="test" type="select" :options="{1: 'AAA', 2: 'BBB' }" @input="changed" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {},
          sameAsValue: null
        }
      },
      methods: {
        changed (value) {
          this.sameAsValue = this.formData.test === value
        }
      }
    })
    wrapper.find('select').setValue('2')
    await flushPromises()
    expect(wrapper.vm.formData.test).toBe('2')
    expect(wrapper.vm.sameAsValue).toBe(true)
  })

  it.skip('properly hydrates when an initial value is zero', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
        >
          <FormulateInput type="range" name="test" />
        </FormulateForm>
      `,
      data () {
        return {
          formData: {
            test: 0,
          }
        }
      }
    })
    await flushPromises()
    expect(wrapper.findComponent(FormulateInput).vm.context.model).toBe(0)
  })

  // This is basically the same test as found in FormulateInputGroup since they share registry logic.
  it.skip('can swap input types with the same name without loosing registration, but resetting values', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
        >
          <div key="it" v-if="lang === 'it'" data-is-italian>
            <FormulateInput type="text" name="test" label="Il tuo nome" />
          </div>
          <div key="en" v-else data-is-english>
            <FormulateInput type="text" name="test" label="Your name please" />
          </div>
          <FormulateInput type="text" name="country" value="it" />
        </FormulateForm>
      `,
      data () {
        return {
          lang: 'it',
          formData: {}
        }
      }
    })
    await flushPromises()
    wrapper.find('input').setValue('Justin')
    await flushPromises()
    expect(wrapper.vm.formData.test).toBe('Justin')
    wrapper.setData({ lang: 'en' })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.registry.has('test')).toBe(true)
    expect(wrapper.findComponent(FormulateForm).vm.proxy).toEqual({ country: 'it' })
  })

  it.skip('can keep values when keepModelData is set to true on an input', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
        >
          <div key="it" v-if="lang === 'it'" data-is-italian>
            <FormulateInput type="text" name="test" :keep-model-data="true" label="Il tuo nome" />
          </div>
          <div key="en" v-else data-is-english>
            <FormulateInput type="text" name="test" :keep-model-data="true" label="Your name please" />
          </div>
          <FormulateInput type="text" name="country" value="it" />
        </FormulateForm>
      `,
      data () {
        return {
          lang: 'it',
          formData: {}
        }
      }
    })
    await flushPromises()
    wrapper.find('input').setValue('JigglyPuff')
    await flushPromises()
    expect(wrapper.vm.formData.test).toBe('JigglyPuff')
    wrapper.setData({ lang: 'en' })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.registry.has('test')).toBe(true)
    expect(wrapper.findComponent(FormulateForm).vm.proxy).toEqual({ country: 'it', test: 'JigglyPuff' })
  })

  it.skip('can keep values when keepModelData is set to true on a form', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm
          v-model="formData"
          :keep-model-data="true"
        >
          <div key="it" v-if="lang === 'it'" data-is-italian>
            <FormulateInput type="text" name="test" label="Il tuo nome" />
          </div>
          <div key="en" v-else data-is-english>
            <FormulateInput type="text" name="test" label="Your name please" />
          </div>
          <FormulateInput type="text" name="country" value="it" />
        </FormulateForm>
      `,
      data () {
        return {
          lang: 'it',
          formData: {}
        }
      }
    })
    await flushPromises()
    wrapper.find('input').setValue('JigglyPuff')
    await flushPromises()
    expect(wrapper.vm.formData.test).toBe('JigglyPuff')
    wrapper.setData({ lang: 'en' })
    await flushPromises()
    expect(wrapper.findComponent(FormulateForm).vm.registry.has('test')).toBe(true)
    expect(wrapper.findComponent(FormulateForm).vm.proxy).toEqual({ country: 'it', test: 'JigglyPuff' })
  })
})
