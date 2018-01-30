import test from 'ava'
import f from '../dist'

const rules = f.rules
const error = ({field, value}, label) => {
  return `${field}${label}`
}

test('test required rule failure', async t => {
  let v = await rules.required({field: 'name', value: '', error}, 'xyz')
  t.is('string', typeof v)
  t.is('namexyz', v)
})

test('test required rule passes', async t => {
  t.is(false, await rules.required({field: 'name', value: 'Justin'}))
})

test('test email rule with valid email', async t => {
  t.is(false, await rules.email({field: 'email', value: 'valid@example.com'}))
})

test('test email rule with invalid email', async t => {
  t.is('email123', await rules.email({field: 'email', value: 'invalid@example', error}, '123'))
})

test('test email with empty email', async t => {
  t.is(false, await rules.email({field: 'email', value: '', error}))
})

test('test confirmed passes', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: 'password',
    error,
    values: {password_confirmation: 'password'}
  }, '123'))
})

test('test confirmed passes custom field', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: 'password',
    error,
    values: {customfield: 'password'}
  }, '123', 'customfield'))
})

test('test confirmed fails', async t => {
  t.is('password123', await rules.confirmed({
    field: 'password',
    value: 'password',
    error,
    values: {password_confirmation: 'pAssword'}
  }, '123'))
})

test('test empty confirmed passes', async t => {
  t.is(false, await rules.confirmed({
    field: 'password',
    value: '',
    error,
    values: {password_confirmation: ''}
  }, '123'))
})
