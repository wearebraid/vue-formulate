import test from 'ava'
import {formulateState, formulateGetters, formulateMutations} from '../dist'

test('initial store state', async t => {
  t.deepEqual({
    values: {},
    errors: {},
    validationErrors: {},
    meta: {}
  }, formulateState()())
})

test('extended initial store state', async t => {
  t.deepEqual({
    values: {},
    errors: {},
    validationErrors: {},
    meta: {},
    additionalParam: 'test'
  }, formulateState({
    additionalParam: 'test'
  })())
})

test('validationErrors getter', async t => {
  let state = {
    validationErrors: {
      form: {
        field: ['This is an error']
      }
    }
  }
  t.is(formulateGetters().formValidationErrors(state), state.validationErrors)
})

test('errors getter', async t => {
  let state = {
    errors: {
      form: {
        field: ['This is an error', 'second error']
      }
    }
  }
  t.is(formulateGetters().formErrors(state), state.errors)
})

test('values getter', async t => {
  let state = {
    values: {
      form: {
        name: 'Johan',
        field: 'Guttenberg'
      }
    }
  }
  t.is(formulateGetters().formValues(state), state.values)
})

test('formMeta getter', async t => {
  let state = {
    meta: {
      form: {
        name: {name: 'name', label: 'Name'},
        flail: {name: 'email', label: 'Email'}
      }
    }
  }
  t.deepEqual(formulateGetters().formMeta(state), {
    form: [
      {name: 'name', label: 'Name'},
      {name: 'email', label: 'Email'}
    ]
  })
})

test('form has errors', async t => {
  let state = {
    errors: {
      form: {
        field: ['This is an error', 'second error']
      }
    }
  }
  t.is(true, formulateGetters().hasErrors(state).form)
})

test('form has empty errors', async t => {
  let state = {
    errors: {
      form: {
        field: [],
        other: []
      }
    }
  }
  t.is(false, formulateGetters().hasErrors(state).form)
})

test('form has no errors', async t => {
  let state = {
    errors: {
      form: {}
    }
  }
  t.is(false, formulateGetters().hasErrors(state).form)
})

test('adds a new field value', async t => {
  let state = {values: {}}
  formulateMutations().setFieldValue(state, {
    form: 'form',
    field: 'name',
    value: 'test name'
  })
  t.deepEqual(state.values, {form: {name: 'test name'}})
})

test('adds an existing field value', async t => {
  let state = {values: {form: {name: 'old name'}}}
  formulateMutations().setFieldValue(state, {
    form: 'form',
    field: 'name',
    value: 'new name'
  })
  t.deepEqual(state.values, {form: {name: 'new name'}})
})

test('adds an error to new field', async t => {
  let state = {errors: {}}
  formulateMutations().setFieldErrors(state, {
    form: 'form',
    field: 'name',
    errors: ['i dislike this field']
  })
  t.deepEqual(state.errors, {form: {name: ['i dislike this field']}})
})

test('adds an error to existing field', async t => {
  let state = {errors: {form: {name: ['i like this field']}}}
  formulateMutations().setFieldErrors(state, {
    form: 'form',
    field: 'name',
    errors: ['i dislike this field']
  })
  t.deepEqual(state.errors, {form: {name: ['i dislike this field']}})
})

test('adds a validationError to new field', async t => {
  let state = {validationErrors: {}}
  formulateMutations().setFieldValidationErrors(state, {
    form: 'form',
    field: 'name',
    errors: ['i dislike this field']
  })
  t.deepEqual(state.validationErrors, {form: {name: ['i dislike this field']}})
})

test('adds a validationError to existing field', async t => {
  let state = {validationErrors: {form: {name: ['i like this field']}}}
  formulateMutations().setFieldValidationErrors(state, {
    form: 'form',
    field: 'name',
    errors: ['i dislike this field']
  })
  t.deepEqual(state.validationErrors, {form: {name: ['i dislike this field']}})
})

test('reset a form', async t => {
  let state = {values: {login: {username: 'testuser', password: 'secret'}}}
  formulateMutations().resetForm(state, 'login')
  t.deepEqual(state.values, {login: {username: undefined, password: undefined}})
})

test('wont mutate undefined form on reset', async t => {
  let state = {values: {login: {username: 'testuser', password: 'secret'}}}
  formulateMutations().resetForm(state, 'register')
  t.deepEqual(state.values, {login: {username: 'testuser', password: 'secret'}})
})

test('removeField deletes values from store', async t => {
  let state = {
    values: {
      register: {
        username: 'testuser',
        password: 'secret'
      }
    }
  }
  formulateMutations().removeField(state, {form: 'register', field: 'password'})
  t.deepEqual({
    values: {
      register: {
        username: 'testuser'
      }
    }
  }, state)
})
