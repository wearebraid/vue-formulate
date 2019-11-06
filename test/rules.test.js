import rules from '@/libs/rules'

/**
 * Required rule
 */
describe('required', () => {
  it('fails on empty string', async () => expect(await rules.required('')).toBe(false))

  it('fails on empty array', async () => expect(await rules.required([])).toBe(false))

  it('fails on empty object', async () => expect(await rules.required({})).toBe(false))

  it('fails on null', async () => expect(await rules.required(null)).toBe(false))

  it('passes with the number zero', async () => expect(await rules.required(0)).toBe(true))

  it('passes with the boolean false', async () => expect(await rules.required(false)).toBe(true))

  it('passes with a non empty array', async () => expect(await rules.required(['123'])).toBe(true))

  it('passes with a non empty object', async () => expect(await rules.required({a: 'b'})).toBe(true))
})


/**
 * In rule
 */
describe('in', () => {
  it('fails when not in stack', async () => {
    expect(await rules.in('third', 'first', 'second')).toBe(false)
  })

  it('fails when case sensitive mismatch is in stack', async () => {
    expect(await rules.in('third', 'first', 'second', 'Third')).toBe(false)
  })

  it('fails comparing dissimilar objects', async () => {
    expect(await rules.in({f: 'abc'}, {a: 'cdf'}, {b: 'abc'})).toBe(false)
  })

  it('passes when case sensitive match is in stack', async () => {
    expect(await rules.in('third', 'first', 'second', 'third')).toBe(true)
  })

  it('passes a shallow array compare', async () => {
    expect(await rules.in(['abc'], ['cdf'], ['abc'])).toBe(true)
  })

  it('passes a shallow object compare', async () => {
    expect(await rules.in({f: 'abc'}, {a: 'cdf'}, {f: 'abc'},)).toBe(true)
  })
})

/**
 * Matches rule
 */
describe('matches', () => {
  it('simple strings fail if they aren’t equal', async () => {
    expect(await rules.matches('third', 'first')).toBe(false)
  })

  it('fails on non matching regex', async () => {
    expect(await rules.matches('third', /^thirds/)).toBe(false)
  })

  it('passes if simple strings match', async () => {
    expect(await rules.matches('second', 'third', 'second')).toBe(true)
  })

  it('passes on matching regex', async () => {
    expect(await rules.matches('third', /^third/)).toBe(true)
  })

  it('passes on matching mixed regex and string', async () => {
    expect(await rules.matches('first-fourth', 'second', /^third/, /fourth$/)).toBe(true)
  })
})
