import Formulate from '../src/Formulate.js'

test('can extend simple object', () => {
  let a = {
    optionA: true,
    optionB: '1234'
  }
  let b = {
    optionA: false
  }
  expect(Formulate.extend(a, b)).toEqual({
    optionA: false,
    optionB: '1234'
  })
})


test('can extend recursively', () => {
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
  expect(Formulate.extend(a, b)).toEqual({
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
    'FormulateInputBox',
    'FormulateInputText',
    'FormulateInputGroup',
    'FormulateInputSelect',
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
