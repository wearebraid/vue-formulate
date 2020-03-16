import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Formulate from '../../src/Formulate.js'
import FileUpload from '../../src/FileUpload.js'
import FormulateInput from '@/FormulateInput.vue'
import FormulateInputFile from '@/inputs/FormulateInputFile.vue'

Vue.use(Formulate)

describe('FormulateInputFile', () => {

  it('type "file" renders a file element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'file' } })
    expect(wrapper.contains(FormulateInputFile)).toBe(true)
  })

  it('type "image" renders a file element', () => {
    const wrapper = mount(FormulateInput, { propsData: { type: 'image' } })
    expect(wrapper.contains(FormulateInputFile)).toBe(true)
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
