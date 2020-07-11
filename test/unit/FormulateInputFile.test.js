import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '@/Formulate.js'
import FileUpload from '@/FileUpload.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputFile from '@/inputs/FormulateInputFile.vue'

Vue.use(Formulate)

describe('FormulateInputFile', () => {

  it('type "file" renders a file element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'file' } })
    expect(wrapper.findComponent(FormulateInputFile).exists()).toBe(true)
  })

  it('type "image" renders a file element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image' } })
    expect(wrapper.findComponent(FormulateInputFile).exists()).toBe(true)
  })

  it('forces an error-behavior live mode when upload-behavior is live and it has content', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image', validation: 'mime:image/jpeg', value: [{ url: 'img.jpg' }] } })
    expect(wrapper.vm.showValidationErrors).toBe(true)
  })

  it('wont show errors when upload-behavior is live and it is required but empty', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image', validation: 'required|mime:image/jpeg' } })
    expect(wrapper.vm.showValidationErrors).toBe(false)
  })

  it('contains a data-has-preview attribute when showing a preview', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image', value: [ { url: 'https://www.example.com/image.png' } ], validation: 'required|mime:image/jpeg' } })
    const file = wrapper.find('[data-has-preview]')
    expect(file.exists()).toBe(true)
    expect(file.attributes('data-has-preview')).toBe('true')
  })

  it('passes an explicitly given name prop through to the root element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image', name: 'foo' } })
    expect(wrapper.find('input[name="foo"]').exists()).toBe(true)
  })

  it('additional context does not bleed through to file input attributes', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image' } } )
    expect(Object.keys(wrapper.find('input[type="file"]').attributes())).toEqual(["type", "id"])
  })

  it('can add classes to the element wrapper', () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'file', elementClass: ['test-class']}
    })
    expect(wrapper.findComponent(FormulateInputFile).attributes('class'))
      .toBe('formulate-input-element formulate-input-element--file test-class')
  })

  it('can add classes to the input element', () => {
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'file', inputClass: ['test-class']}
    })
    expect(wrapper.find('input').attributes('class'))
      .toBe('test-class')
  })

  it('has default upload area class and can override it', async () => {
    const wrapper = mount(FormulateInput, {
      propsData: {
        type: 'file',
        value: [{ url: '/file.svg' }],
        uploadAreaClass: ['test-1-class'],
        uploadAreaMaskClass: ['test-2-class'],
        filesClass: ['test-3-class'],
        fileClass: ['test-4-class'],
        fileNameClass: ['test-5-class'],
        fileRemoveClass: ['test-6-class'],
        fileProgressClass: ['test-7-class'],
        fileUploadError: ['test-8-class'],
        fileImagePreview: ['test-9-class'],
        fileProgressInnerClass: ['test-10-class']
      }
    })
    await flushPromises()
    expect(wrapper.find('.formulate-input-upload-area').attributes('class'))
      .toBe('formulate-input-upload-area test-1-class')

    expect(wrapper.find('.formulate-input-upload-area-mask').attributes('class'))
      .toBe('formulate-input-upload-area-mask test-2-class')

    expect(wrapper.find('ul').attributes('class'))
      .toBe('formulate-files test-3-class')

    expect(wrapper.find('.formulate-file').attributes('class'))
      .toBe('formulate-file test-4-class')

    expect(wrapper.find('.formulate-file').attributes('class'))
      .toBe('formulate-file test-4-class')

    expect(wrapper.find('.formulate-file-name').attributes('class'))
      .toBe('formulate-file-name test-5-class')

    expect(wrapper.find('.formulate-file-remove').attributes('class'))
      .toBe('formulate-file-remove test-6-class')
  })

  it('emits a focus event', async () => {
    const focus = jest.fn()
    const wrapper = mount(FormulateInput, {
      propsData: { type: 'file', label: 'Submit me' },
      listeners: { focus }
    })
    wrapper.find('input[type="file"]').trigger('focus')
    await flushPromises()
    expect(focus.mock.calls.length).toBe(1);
  })

  /**
   * ===========================================================================
   * Currently there appears to be no way to properly mock upload data in
   * vue-test-utils because JSDom doesn't implement DataTransfer:
   *
   * https://stackoverflow.com/questions/48993134/how-to-test-input-file-with-jest-and-vue-test-utils
   */
  // it('type "image" renders a file element', async () => {

  // })
})
