import test from 'ava'
import f from '../dist'

const rules = f.rules
const error = ({field, value, label}) => {
  return `${field}${label}`
}

test('test required rule failure', async t => {
  let v = await rules.required({field: 'name', value: '', error, label: 'xyz'})
  t.is('string', typeof v)
  t.is('namexyz', v)
})

test('test number no failure on empty', async t => {
  let v = await rules.number({field: 'name', value: '', error, label: 'xyz'})
  t.is(false, v)
})

test('test number failure not number', async t => {
  let v = await rules.number({field: 'name', value: 't', error, label: 'xyz'})
  t.is('string', typeof v)
  t.is('namexyz', v)
})

test('test number is typeof number', async t => {
  let v = await rules.number({field: 'name', value: '3', error, label: 'xyz'})
  t.is(false, v)
})

test('test required rule empty array failure', async t => {
  let v = await rules.required({field: 'name', value: [], error, label: 'xyz'})
  t.is('namexyz', v)
})

test('test required rule passes', async t => {
  t.is(false, await rules.required({field: 'name', value: 'Justin'}))
})

test('test email rule with valid email', async t => {
  t.is(false, await rules.email({field: 'email', value: 'valid@example.com'}))
})

test('test email rule with invalid email', async t => {
  t.is('email123', await rules.email({field: 'email', value: 'invalid@example', error, label: '123'}))
})

test('test email with empty email', async t => {
  t.is(false, await rules.email({field: 'email', value: '', error}))
})

test('test confirmed passes', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: 'password',
    label: '123',
    error,
    values: {password_confirmation: 'password'}
  }))
})

test('test confirmed passes custom field', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: 'password',
    label: '123',
    error,
    values: {customfield: 'password'}
  }, 'customfield'))
})

test('test confirmed fails', async t => {
  t.is('password123', await rules.confirmed({
    field: 'password',
    value: 'password',
    label: '123',
    error,
    values: {password_confirmation: 'pAssword'}
  }))
})

test('test empty confirmed passes', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: '',
    label: '123',
    error,
    values: {password_confirmation: ''}
  }))
})
