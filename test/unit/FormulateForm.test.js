import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '../../src/Formulate.js'
import FormSubmission from '../../src/FormSubmission.js'
import FormulateForm from '@/FormulateForm.vue'
import FormulateInput from '@/FormulateInput.vue'

Vue.use(Formulate)

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


  it('intercepts submit event', () => {
    const formSubmitted = jest.fn()
    const wrapper = mount(FormulateForm, {
      slots: {
        default: "<button type='submit' />"
      },
      methods: {
        formSubmitted
      }
    })
    wrapper.find('form').trigger('submit')
    expect(formSubmitted).toBeCalled()
  })

  it('registers its subcomponents', () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { testinput: 'has initial value' } },
      slots: { default: '<FormulateInput type="text" name="subinput1" /><FormulateInput type="checkbox" name="subinput2" />' }
    })
    expect(Object.keys(wrapper.vm.registry)).toEqual(['subinput1', 'subinput2'])
  })

  it('can set a field’s initial value', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { testinput: 'has initial value' } },
      slots: { default: '<FormulateInput type="text" name="testinput" />' }
    })
    await flushPromises()
    expect(wrapper.find('input').element.value).toBe('has initial value')
  })

  it('lets individual fields override form initial value', () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { testinput: 'has initial value' } },
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
        <FormulateInput name="name" value="123" />
      </FormulateForm>`
    })
    expect(wrapper.vm.formValues).toEqual({ name: '123' })
  })

  it('can set initial checked attribute on single checkboxes', () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { box1: true } },
      slots: { default: '<FormulateInput type="checkbox" name="box1" />' }
    })
    expect(wrapper.find('input[type="checkbox"]').is(':checked')).toBe(true)
  });

  it('can set initial unchecked attribute on single checkboxes', () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { box1: false } },
      slots: { default: '<FormulateInput type="checkbox" name="box1" />' }
    })
    expect(wrapper.find('input[type="checkbox"]').is(':checked')).toBe(false)
  });

  it('can set checkbox initial value with options', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { box2: ['second', 'third'] } },
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



  // ===========================================================================
  /**
   * @todo in vue-test-utils version 1.0.0-beta.29 has some bugs related to
   * synchronous updating. Some details are here:
   *
   * @update this test was re-implemented in version 1.0.0-beta.31 and seems to
   * be workign now with flushPromises(). Leaving these docs here for now.
   *
   * https://github.com/vuejs/vue-test-utils/issues/1130
   *
   * This test is being commented out until there is a resolution on this issue,
   * and instead being replaced with a mock call.
   */

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

  // ===========================================================================

  // Replacement test for the above test - not quite as good of a test.
  it('updates calls setFieldValue on form when a field contains a populated v-model on registration', () => {
    const wrapper = mount(FormulateForm, {
      propsData: {
        formulateValue: { testinput: '123' }
      },
      slots: {
        default: '<FormulateInput type="text" name="testinput" formulate-value="override-data" />'
      }
    })
    expect(wrapper.emitted().input[wrapper.emitted().input.length - 1]).toEqual([{ testinput: 'override-data' }])
  })


  it('emits an instance of FormSubmission', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" formulate-value="123" name="testinput" />' }
    })
    wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.emitted('submit-raw')[0][0]).toBeInstanceOf(FormSubmission)
  })

  it('resolves hasValidationErrors to true', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" validation="required" name="testinput" />' }
    })
    wrapper.find('form').trigger('submit')
    await flushPromises()
    const submission = wrapper.emitted('submit-raw')[0][0]
    expect(await submission.hasValidationErrors()).toBe(true)
  })

  it('resolves submitted form values to an object', async () => {
    const wrapper = mount(FormulateForm, {
      slots: { default: '<FormulateInput type="text" validation="required" name="testinput" value="Justin" />' }
    })
    const submission = await wrapper.vm.formSubmitted()
    expect(submission).toEqual({testinput: 'Justin'})
  })

  it('accepts a values prop and uses it to set the initial values', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { values: { name: 'Dave Barnett', candy: true } },
      slots: { default: `<FormulateInput type="text" name="name" validation="required" /><FormulateInput type="checkbox" name="candy" />` }
    })
    await flushPromises()
    // expect(wrapper.vm.internalFormModelProxy).toEqual({ name: 'Dave Barnett', candy: true })
    expect(wrapper.find('input[type="text"]').element.value).toBe('Dave Barnett')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })

  it('shows error messages when it includes a checkbox with options', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { box3: [] } },
      slots: { default: '<FormulateInput type="checkbox" name="box3" validation="required" :options="{first: \'First\', second: \'Second\', third: \'Third\'}" />' }
    })
    wrapper.trigger('submit')
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.find('.formulate-input-error').exists()).toBe(true)
  })

  it('automatically registers with root plugin', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formulateValue: { box3: [] }, name: 'login' }
    })
    expect(wrapper.vm.$formulate.registry.has('login')).toBe(true)
    expect(wrapper.vm.$formulate.registry.get('login')).toBe(wrapper.vm)
  })

  it('calls custom error handler with error and name', async () => {
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

  it('errors are displayed on correctly named components', async () => {
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

  it('errors are displayed on correctly named components', async () => {
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

  it('hides root FormError if another form error exists and renders in new location', async () => {
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
    expect(wrapper.find('h1 + *').is('.formulate-form-errors')).toBe(true)
  })

  it('allows rendering multiple locations', async () => {
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

  it('receives a form-errors prop and displays it', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formErrors: ['first', 'second'] },
      slots: {
        default: '<FormulateInput name="name" />'
      }
    })
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-error').length).toBe(2)
  })

  it('it aggregates form-errors prop with form-named errors', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { formErrors: ['first', 'second'], name: 'login' }
    })
    wrapper.vm.$formulate.handle({ formErrors: ['third'] }, 'login')
    await flushPromises()
    expect(wrapper.findAll('.formulate-form-error').length).toBe(3)
  })

  it('displays field errors on inputs with errors prop', async () => {
    const wrapper = mount(FormulateForm, {
      propsData: { errors: { sipple: ['This field has an error'] }},
      slots: {
        default: '<FormulateInput name="sipple" />'
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.formulate-input .formulate-input-error').exists()).toBe(true)
  })

  it('is able to display multiple errors on multiple elements', async () => {
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

  it('it can set multiple field errors with handle()', async () => {
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

  it('only sets 1 error when used on a FormulateGroup input', async () => {
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

  it('properly de-registers an observer when removed', async () => {
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
    expect(wrapper.find(FormulateForm).vm.errorObservers.length).toBe(1)
    wrapper.setData({ hasField: false })
    await flushPromises()
    expect(wrapper.find(FormulateForm).vm.errorObservers.length).toBe(0)
  })
})
