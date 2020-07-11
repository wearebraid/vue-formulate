import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '@/Formulate.js'
import FileUpload from '@/FileUpload.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateForm from '@/FormulateForm.vue'
import FormulateGrouping from '@/FormulateGrouping.vue'
import FormulateRepeatableProvider from '@/FormulateRepeatableProvider.vue'

Vue.use(Formulate)

describe('FormulateInputGroup', () => {
  it('allows nested fields to be sub-rendered', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group' },
      slots: {
        default: '<FormulateInput type="text" />'
      }
    })
    expect(wrapper.findAll('.formulate-input-group-repeatable input[type="text"]').length).toBe(1)
  })

  it('registers sub-fields with grouping', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group' },
      slots: {
        default: '<FormulateInput type="text" name="persona" />'
      }
    })
    expect(wrapper.findComponent(FormulateRepeatableProvider).vm.registry.has('persona')).toBeTruthy()
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

  it('v-modeling a subfield updates group v-model value', async () => {
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
    expect(wrapper.vm.users).toEqual([{email: 'jim@example.com'}, {email:'jim@example.com'}])
  })

  it('prevents form submission when children have validation errors', async () => {
    const submit = jest.fn()
    const wrapper = mount({
      template: `
        <FormulateForm
          @submit="submit"
        >
          <FormulateInput
            type="text"
            validation="required"
            value="testing123"
            name="name"
          />
          <FormulateInput
            v-model="users"
            type="group"
          >
            <FormulateInput type="text" name="email" />
            <FormulateInput type="text" name="name" validation="required" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `,
      data () {
        return {
          users: [{email: 'jon@example.com'}, {email:'jane@example.com'}],
        }
      },
      methods: {
        submit
      }
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    expect(submit.mock.calls.length).toBe(0);
  })

  it('allows form submission with children when there are no validation errors', async () => {
    const submit = jest.fn()
    const wrapper = mount({
      template: `
        <FormulateForm
          @submit="submit"
        >
          <FormulateInput
            type="text"
            validation="required"
            value="testing123"
            name="name"
          />
          <FormulateInput
            name="users"
            type="group"
          >
            <FormulateInput type="text" name="email" validation="required|email" value="justin@wearebraid.com" />
            <FormulateInput type="text" name="name" validation="required" value="party" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `,
      methods: {
        submit
      }
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    expect(submit.mock.calls.length).toBe(1);
  })

  it('displays validation errors on group children when form is submitted', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput
            name="users"
            type="group"
            :repeatable="true"
          >
            <FormulateInput type="text" name="name" validation="required" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    await flushPromises()
    expect(wrapper.find('[data-classification="text"] .formulate-input-error').exists()).toBe(true);
  })

  it('displays error messages on newly registered fields when formShouldShowErrors is true', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput
            name="users"
            type="group"
            :repeatable="true"
          >
            <FormulateInput type="text" name="name" validation="required" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    // Click the add more button
    wrapper.find('button[type="button"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-classification="text"] .formulate-input-error').length).toBe(2)
  })

  it('displays error messages on newly registered fields when formShouldShowErrors is true', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput
            name="users"
            type="group"
            :repeatable="true"
          >
            <FormulateInput type="text" name="name" validation="required" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    // Click the add more button
    wrapper.find('button[type="button"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-classification="text"] .formulate-input-error').length).toBe(2)
  })

  it('allows the removal of groups', async () => {
    const wrapper = mount({
      template: `
      <FormulateForm>
        <FormulateInput
          name="users"
          type="group"
          :repeatable="true"
          v-model="users"
        >
          <FormulateInput type="text" name="name" validation="required" />
        </FormulateInput>
        <FormulateInput type="submit" />
      </FormulateForm>
      `,
      data () {
        return {
          users: [{name: 'justin'}, {name: 'bill'}]
        }
      }
    })
    await flushPromises()
    wrapper.find('.formulate-input-group-repeatable-remove').trigger('click')
    await flushPromises()
    expect(wrapper.vm.users).toEqual([{name: 'bill'}])
  })

  it('removes groups when there are none', async () => {
    const wrapper = mount({
      template: `
      <FormulateForm>
        <FormulateInput
          name="users"
          type="group"
          :repeatable="true"
          v-model="users"
        >
          <FormulateInput type="text" name="name" validation="required" />
        </FormulateInput>
        <FormulateInput type="submit" />
      </FormulateForm>
      `,
      data () {
        return {
          users: undefined
        }
      }
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    await flushPromises()
    wrapper.find('.formulate-input-group-repeatable-remove').trigger('click')
    await flushPromises()
    expect(wrapper.find('input[type="text"]').exists()).toBe(false)
  })

  it('fills to minimum and will not remove when at its minimum', async () => {
    const wrapper = mount({
      template: `
      <FormulateForm>
        <FormulateInput
          name="users"
          type="group"
          :repeatable="true"
          minimum="3"
          v-model="users"
        >
          <FormulateInput type="text" name="name" validation="required" />
        </FormulateInput>
        <FormulateInput type="submit" />
      </FormulateForm>
      `,
      data () {
        return {
          users: undefined
        }
      }
    })
    expect(wrapper.findAll('input[type="text"]').length).toBe(3)
    await flushPromises()
    wrapper.find('.formulate-input-group-repeatable-remove').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('input[type="text"]').length).toBe(3)
  })

  it('can override the add more text', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { addLabel: '+ Add a user', type: 'group', repeatable: true },
      slots: {
        default: '<div />'
      }
    })
    expect(wrapper.find('button').text()).toEqual('+ Add a user')
  })

  it('does not allow more than the limit', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { addLabel: '+ Add a user', type: 'group', repeatable: true, limit: 2, value: [{}, {}]},
      slots: {
        default: '<div class="repeated"/>'
      }
    })
    expect(wrapper.findAll('.repeated').length).toBe(2)
    expect(wrapper.find('button').exists()).toBeFalsy()
  })

  it('does not truncate the number of items if value is more than limit', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { addLabel: '+ Add a user', type: 'group', repeatable: true, limit: 2, value: [{}, {}, {}, {}]},
      slots: {
        default: '<div class="repeated"/>'
      }
    })
    expect(wrapper.findAll('.repeated').length).toBe(4)
  })

  it('allows a slot override of the add button and has addItem prop', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true, addLabel: '+ Name' },
      scopedSlots: {
        default: '<div class="repeatable" />',
        addmore: '<span class="add-name" @click="props.addMore">{{ props.addLabel }}</span>'
      }
    })
    expect(wrapper.find('.formulate-input-group-add-more').exists()).toBeFalsy()
    const addButton = wrapper.find('.add-name')
    expect(addButton.text()).toBe('+ Name')
    addButton.trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.repeatable').length).toBe(2)
  })

  it('allows a slot override of the repeatable area', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true, value: [{}, {}]},
      scopedSlots: {
        repeatable: '<div class="repeat">{{ props.index }}<div class="remove" @click="props.removeItem" /></div>',
      }
    })
    const repeats = wrapper.findAll('.repeat')
    expect(repeats.length).toBe(2)
    expect(repeats.at(1).text()).toBe("1")
    wrapper.find('.remove').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.repeat').length).toBe(1)
  })

  it('allows a slot override of the remove area', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true, value: [{phone: 'iPhone'}, {phone: 'Android'}]},
      scopedSlots: {
        default: '<FormulateInput type="text" name="phone" />',
        remove: '<button @click="props.removeItem" class="remove-this">Get outta here</button>',
      }
    })
    const repeats = wrapper.findAll('.remove-this')
    expect(repeats.length).toBe(2)
    const button = wrapper.find('.remove-this')
    expect(button.text()).toBe('Get outta here')
    button.trigger('click')
    await flushPromises()
    expect(wrapper.findAll('input').wrappers.map(w => w.element.value)).toEqual(['Android'])
  })

  it('removes the proper item from the group', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'group', repeatable: true },
      slots: {
        default: '<FormulateInput type="text" name="foo" />'
      }
    })
    wrapper.find('input').setValue('first entry')
    wrapper.find('.formulate-input-group-add-more button').trigger('click')
    wrapper.find('.formulate-input-group-add-more button').trigger('click')
    await flushPromises();
    wrapper.findAll('input').at(1).setValue('second entry')
    wrapper.findAll('input').at(2).setValue('third entry')
    // First verify all the proper entries are where we expect
    expect(wrapper.findAll('input').wrappers.map(input => input.element.value)).toEqual(['first entry', 'second entry', 'third entry'])
    // Now remove the middle one
    wrapper.findAll('.formulate-input-group-repeatable-remove').at(1).trigger('click')
    await flushPromises()
    expect(wrapper.findAll('input').wrappers.map(input => input.element.value)).toEqual(['first entry', 'third entry'])
  })

  it('does not show an error message on group input when child has an error', async () => {
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput
            type="text"
            validation="required"
            value="testing123"
            name="name"
          />
          <FormulateInput
            v-model="users"
            type="group"
          >
            <FormulateInput type="text" name="email" />
            <FormulateInput type="text" name="name" validation="required" />
          </FormulateInput>
          <FormulateInput type="submit" />
        </FormulateForm>
      `,
      data () {
        return {
          users: [{email: 'jon@example.com'}, {}],
        }
      }
    })
    const form = wrapper.findComponent(FormulateForm)
    await form.vm.formSubmitted()
    expect(wrapper.find('[data-classification="group"] > .formulate-input-errors').exists()).toBe(false)
  })

  it('exposes the index to the context object on default slot', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          type="group"
          name="test"
          #default="{ name, index }"
          :value="[{}, {}]"
        >
          <div class="repeatable">{{ name }}-{{ index }}</div>
        </FormulateInput>
      `,
    })
    const repeatables = wrapper.findAll('.repeatable')
    expect(repeatables.length).toBe(2)
    expect(repeatables.at(0).text()).toBe('test-0')
    expect(repeatables.at(1).text()).toBe('test-1')
  })

  it('forces non-repeatable groups to not initialize with an empty array', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          type="group"
          name="test"
          v-model="model"
        >
          <div class="repeatable" />
        </FormulateInput>
      `,
      data () {
        return {
          model: []
        }
      }
    })
    await flushPromises();
    expect(wrapper.findComponent(FormulateGrouping).vm.items).toEqual([{}])
  })

  it('allows repeatable groups to initialize with an empty array', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          type="group"
          name="test"
          :repeatable="true"
          v-model="model"
        >
          <div class="repeatable" />
        </FormulateInput>
      `,
      data () {
        return {
          model: []
        }
      }
    })
    await flushPromises();
    expect(wrapper.findComponent(FormulateGrouping).vm.items).toEqual([])
  })

  it('sets data-has-value on parent when any child has a value', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          type="group"
          name="test"
          :repeatable="true"
          v-model="model"
        >
          <FormulateInput
            name="field"
            type="text"
          />
        </FormulateInput>
      `,
      data () {
        return {
          model: [{}, {}]
        }
      }
    })
    await flushPromises();
    expect(wrapper.attributes('data-has-value')).toBe(undefined)
    wrapper.find('input').setValue('a value')
    await flushPromises()
    expect(wrapper.attributes('data-has-value')).toBe('true')
  })

  it('allows group specific classes to be extended', async () => {
    const wrapper = mount({
      template: `
        <FormulateInput
          type="group"
          name="test"
          :repeatable="true"
          v-model="model"
          :grouping-class="['g-1-test']"
          :group-repeatable-class="['g-2-test']"
          :group-repeatable-remove-class="['g-3-test']"
          :group-add-more-class="['g-4-test']"
        >
          <FormulateInput
            name="field"
            type="text"
          />
        </FormulateInput>
      `,
      data () {
        return {
          model: [{}]
        }
      }
    })
    await flushPromises();

    expect(wrapper.findComponent(FormulateGrouping).attributes('class'))
      .toBe('formulate-input-grouping g-1-test')

    expect(wrapper.find('.formulate-input-group-repeatable').attributes('class'))
      .toBe('formulate-input-group-repeatable g-2-test')

    expect(wrapper.find('.formulate-input-group-repeatable-remove').attributes('class'))
      .toBe('formulate-input-group-repeatable-remove g-3-test')

    expect(wrapper.find('.formulate-input-group-add-more').attributes('class'))
      .toBe('formulate-input-group-add-more g-4-test')
  })

  it('has the proper formValues when using a custom validation message', async () => {
    const custom = jest.fn()
    const wrapper = mount({
      template: `
        <FormulateForm>
          <FormulateInput
            type="group"
            name="test"
            v-model="model"
          >
            <FormulateInput
              name="username"
              type="text"
            />
            <FormulateInput
              name="email"
              type="text"
              validation="email"
              :validation-messages="{
                email: custom
              }"
            />
          </FormulateInput>
        </FormulateForm>
      `,
      data () {
        return {
          model: [{username: 'person', email: 'person@example'}]
        }
      },
      methods: {
        custom
      }
    })
    await flushPromises();
    expect(custom.mock.calls[0][0].formValues).toEqual({
      test: [{username: 'person', email: 'person@example'}]
    })
  })
})
