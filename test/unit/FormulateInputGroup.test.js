import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '@/Formulate.js'
import FileUpload from '@/FileUpload.js'
import FormulateInput from '@/FormulateInput.vue'

Vue.use(Formulate)

describe('FormulateInputGroup', () => {
  it('allows nested fields to be sub-rendered', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group' },
      slots: {
        default: '<FormulateInput type="text" />'
      }
    })
    expect(wrapper.findAll('.formulate-input-grouping input[type="text"]').length).toBe(1)
  })

  it('registers sub-fields with grouping', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group' },
      slots: {
        default: '<FormulateInput type="text" />'
      }
    })
    expect(wrapper.findAll('.formulate-input-grouping input[type="text"]').length).toBe(1)
  })

  it('is not repeatable by default', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group' },
      slots: {
        default: '<FormulateInput type="text" />'
      }
    })
    expect(wrapper.findAll('.formulate-input-group-add-more').length).toBe(0)
  })

  it('adds an add more button when repeatable', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true },
      slots: {
        default: '<FormulateInput type="text" />'
      }
    })
    expect(wrapper.findAll('.formulate-input-group-add-more').length).toBe(1)
  })

  it('repeats the default slot when adding more', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true },
      slots: {
        default: '<div class="wrap"><FormulateInput type="text" /></div>'
      }
    })
    wrapper.find('.formulate-input-group-add-more button').trigger('click')
    await flushPromises();
    expect(wrapper.findAll('.wrap').length).toBe(2)
  })

  it('re-hydrates a repeatable field', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true, value: [{email: 'jon@example.com'}, {email:'jane@example.com'}] },
      slots: {
        default: '<div class="wrap"><FormulateInput type="text" name="email" /></div>'
      }
    })
    await flushPromises()
    const fields = wrapper.findAll('input[type="text"]')
    expect(fields.length).toBe(2)
    expect(fields.at(0).element.value).toBe('jon@example.com')
    expect(fields.at(1).element.value).toBe('jane@example.com')
  })

  it('v-modeling a subfield changes all values', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          v-model="users"
          type="group"
        >
          <FormulateInput type="text" v-model="email" name="email" />
          <FormulateInput type="text" name="name" />
        </FormulateInput>
      `,
      data () {
        return {
          users: [{email: 'jon@example.com'}, {email:'jane@example.com'}],
          email: 'jim@example.com'
        }
      }
    })
    await flushPromises()
    const fields = wrapper.findAll('input[type="text"]')
    expect(fields.length).toBe(4)
    expect(fields.at(0).element.value).toBe('jim@example.com')
    expect(fields.at(2).element.value).toBe('jim@example.com')
  })
})
