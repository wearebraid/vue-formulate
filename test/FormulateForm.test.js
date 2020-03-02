import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '../src/Formulate.js'
import FormSubmission from '../src/FormSubmission.js'
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
})
