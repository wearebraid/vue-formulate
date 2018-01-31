import test from 'ava'
import formulate from '../dist'
import VueMock from './mocks/VueMock'

test('checks plugin registration', async t => {
  let components = []
  VueMock.component = (name, object) => components.push({name, object})
  formulate.install(VueMock)
  t.truthy(VueMock.prototype.$formulate)
  t.is(2, components.length)
})

test('parses single rule', async t => {
  let rules = formulate.parseRules('required')
  t.deepEqual([{rule: 'required', args: []}], rules)
})

test('parses multiple rules and trims', async t => {
  let rules = formulate.parseRules('email |required')
  t.deepEqual([{rule: 'email', args: []}, {rule: 'required', args: []}], rules)
})

test('parses rule arguments', async t => {
  let rules = formulate.parseRules('required(Name)|equals(confirm_password, Your Password)')
  t.deepEqual([
    {rule: 'required', args: ['Name']},
    {rule: 'equals', args: ['confirm_password', 'Your Password']}
  ], rules)
})

test('tests single validation error', async t => {
  t.is(1, (await formulate.validationErrors({field: 'email', value: ''}, 'required')).length)
})

test('tests multiple validation errors', async t => {
  t.is(2, (await formulate.validationErrors({field: 'email', value: 'pastaparty'}, 'email|confirmed', {
    email_confirmation: 'pizzaparty'
  })).length)
})

test('tests empty validation string', async t => {
  t.is(false, await formulate.validationErrors({field: 'email', value: 'pastaparty'}, false))
})

test('can extend rules and errors', async t => {
  formulate.install(VueMock, {
    rules: {
      isPizza: ({field, value, error}, label) => value === 'pizza' ? false : error({field, value})
    },
    errors: {
      isPizza: ({field, value}) => `${field} is not a pizza`
    }
  })
  t.deepEqual(['pepperoni is not a pizza'], await formulate.validationErrors({field: 'pepperoni', value: 'meat'}, 'isPizza'))
})
