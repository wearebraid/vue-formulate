import Formulate from '../src/Formulate.js'

test('can merge simple object', () => {
  let a = {
    optionA: true,
    optionB: '1234'
  }
  let b = {
    optionA: false
  }
  expect(Formulate.merge(a, b)).toEqual({
    optionA: false,
    optionB: '1234'
  })
})

test('can add to simple array', () => {
  let a = {
    optionA: true,
    optionB: ['first', 'second']
  }
  let b = {
    optionB: ['third']
  }
  expect(Formulate.merge(a, b, true)).toEqual({
    optionA: true,
    optionB: ['first', 'second', 'third']
  })
})

test('can merge recursively', () => {
  let a = {
    optionA: true,
    optionC: {
      first: '123',
      third: {
        a: 'b'
      }
    },
    optionB: '1234'
  }
  let b = {
    optionB: '567',
    optionC: {
      first: '1234',
      second: '789',
    }
  }
  expect(Formulate.merge(a, b)).toEqual({
    optionA: true,
    optionC: {
      first: '1234',
      third: {
        a: 'b'
      },
      second: '789'
    },
    optionB: '567'
  })
})

test('installs on vue instance', () => {
  const components = [
    'FormulateForm',
    'FormulateInput',
    'FormulateInputErrors',
    'FormulateInputBox',
    'FormulateInputText',
    'FormulateInputFile',
    'FormulateInputGroup',
    'FormulateInputButton',
    'FormulateInputSelect',
    'FormulateInputSlider',
    'FormulateInputTextArea'
  ]
  const registry = []
  function Vue () {}
  Vue.component = function (name, instance) {
    registry.push(name)
  }
  Formulate.install(Vue, { extended: true })
  expect(Vue.prototype.$formulate).toBe(Formulate)
  expect(registry).toEqual(components)
})

test('can extend instance in a plugin', () => {
  function Vue () {}
  Vue.component = function (name, instance) {}
  const plugin = function (i) {
    i.extend({
      rules: {
        testRule: () => false
      }
    })
  }
  Formulate.install(Vue, {
    plugins: [ plugin ]
  })

  expect(typeof Vue.prototype.$formulate.options.rules.testRule).toBe('function')
})
