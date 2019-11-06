import { parseRules } from '@/libs/utils'
import rules from '@/libs/rules'

describe('parseRules', () => {
  it('parses single string rules, returning empty arguments array', () => {
    expect(parseRules('required', rules)).toEqual([
      [rules.required, []]
    ])
  })

  it('throws errors for invalid validation rules', () => {
    expect(() => {
      parseRules('required|notarule', rules)
    }).toThrow()
  })

  it('parses arguments for a rule', () => {
    expect(parseRules('in:foo,bar', rules)).toEqual([
      [rules.in, ['foo', 'bar']]
    ])
  })

  it('parses multiple string rules and arguments', () => {
    expect(parseRules('required|in:foo,bar', rules)).toEqual([
      [rules.required, []],
      [rules.in, ['foo', 'bar']]
    ])
  })

  it('parses multiple array rules and arguments', () => {
    expect(parseRules(['required', 'in:foo,bar'], rules)).toEqual([
      [rules.required, []],
      [rules.in, ['foo', 'bar']]
    ])
  })

  it('parses array rules with expression arguments', () => {
    expect(parseRules([
      ['matches', /^abc/, '1234']
    ], rules)).toEqual([
      [rules.matches, [/^abc/, '1234']]
    ])
  })
})
