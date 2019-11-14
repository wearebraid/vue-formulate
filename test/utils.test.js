import { parseRules, regexForFormat } from '@/libs/utils'
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


describe('regexForFormat', () => {
  it('allows MM format with other characters', () => expect(regexForFormat('abc/MM').test('abc/01')).toBe(true))

  it('fails MM format with single digit', () => expect(regexForFormat('abc/MM').test('abc/1')).toBe(false))

  it('allows M format with single digit', () => expect(regexForFormat('M/abc').test('1/abc')).toBe(true))

  it('fails MM format when out of range', () => expect(regexForFormat('M/abc').test('13/abc')).toBe(false))

  it('fails M format when out of range', () => expect(regexForFormat('M/abc').test('55/abc')).toBe(false))

  it('Replaces double digits before singles', () => expect(regexForFormat('MMM').test('313131')).toBe(false))

  it('allows DD format with zero digit', () => expect(regexForFormat('xyz/DD').test('xyz/01')).toBe(true))

  it('fails DD format with single digit', () => expect(regexForFormat('xyz/DD').test('xyz/9')).toBe(false))

  it('allows D format with single digit', () => expect(regexForFormat('xyz/D').test('xyz/9')).toBe(true))

  it('fails D format with out of range digit', () => expect(regexForFormat('xyz/D').test('xyz/92')).toBe(false))

  it('fails DD format with out of range digit', () => expect(regexForFormat('xyz/D').test('xyz/32')).toBe(false))

  it('allows YY format with double zeros', () => expect(regexForFormat('YY').test('00')).toBe(true))

  it('fails YY format with four zeros', () => expect(regexForFormat('YY').test('0000')).toBe(false))

  it('allows YYYY format with four zeros', () => expect(regexForFormat('YYYY').test('0000')).toBe(true))

  it('allows MD-YY', () => expect(regexForFormat('MD-YY').test('12-00')).toBe(true))

  it('allows DM-YY', () => expect(regexForFormat('DM-YY').test('12-00')).toBe(true))

  it('allows date like MM/DD/YYYY', () => expect(regexForFormat('MM/DD/YYYY').test('12/18/1987')).toBe(true))

  it('allows date like YYYY-MM-DD', () => expect(regexForFormat('YYYY-MM-DD').test('1987-01-31')).toBe(true))

  it('fails date like YYYY-MM-DD with out of bounds day', () => expect(regexForFormat('YYYY-MM-DD').test('1987-01-32')).toBe(false))
})
