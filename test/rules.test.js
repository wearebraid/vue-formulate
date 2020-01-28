import rules from '@/libs/rules'
import FileUpload from '../src/FileUpload'

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

  it('passes with empty value if second argument is false', async () => expect(await rules.required('', false)).toBe(true))

  it('passes with empty value if second argument is false string', async () => expect(await rules.required('', 'false')).toBe(true))
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

/**
 * Accepted rule
 */
describe('accepted', () => {
  it('passes with true', async () => expect(await rules.accepted('yes')).toBe(true))

  it('passes with on', async () => expect(await rules.accepted('on')).toBe(true))

  it('passes with 1', async () => expect(await rules.accepted('1')).toBe(true))

  it('passes with number 1', async () => expect(await rules.accepted(1)).toBe(true))

  it('passes with boolean true', async () => expect(await rules.accepted(true)).toBe(true))

  it('fail with boolean false', async () => expect(await rules.accepted(false)).toBe(false))

  it('fail with "false"', async () => expect(await rules.accepted('false')).toBe(false))
})


/**
 * Url rule.
 *
 * Note: these are just sanity checks because the actual package we use is
 * well tested: https://github.com/segmentio/is-url/blob/master/test/index.js
 */
describe('url', () => {
    it('passes with http://google.com', async () => expect(await rules.url('http://google.com')).toBe(true))

    it('fails with google.com', async () => expect(await rules.url('google.com')).toBe(false))
})

/**
 * Determines if the string is a date
 */
describe('date', () => {
  it('passes with month day year', async () => expect(await rules.date('December 17, 2020')).toBe(true))

  it('passes with month day', async () => expect(await rules.date('December 17')).toBe(true))

  it('passes with short month day', async () => expect(await rules.date('Dec 17')).toBe(true))

  it('passes with short month day', async () => expect(await rules.date('Dec 17 12:34:15')).toBe(true))

  it('passes with out of bounds number', async () => expect(await rules.date('January 77')).toBe(true))

  it('passes with only month', async () => expect(await rules.date('January')).toBe(false))

  it('passes with valid date format', async () => expect(await rules.date('12/17/1987', 'MM/DD/YYYY')).toBe(true))

  it('fails with simple number and date format', async () => expect(await rules.date('1234', 'MM/DD/YYYY')).toBe(false))

  it('fails with only day of week', async () => expect(await rules.date('saturday')).toBe(false))

  it('fails with random string', async () => expect(await rules.date('Pepsi 17')).toBe(false))

  it('fails with random number', async () => expect(await rules.date('1872301237')).toBe(false))

})


/**
 * Checks if a date is after another date
 */
describe('after', () => {
  const today = new Date()
  const tomorrow = new Date()
  const yesterday = new Date()
  tomorrow.setDate(today.getDate() + 1)
  yesterday.setDate(today.getDate() - 1)

  it('passes with tomorrow’s date object', async () => expect(await rules.after(tomorrow)).toBe(true))

  it('passes with future date', async () => expect(await rules.after('January 15, 2999')).toBe(true))

  it('passes with long past date', async () => expect(await rules.after(yesterday, 'Jan 15, 2000')).toBe(true))

  it('fails with yesterday’s date', async () => expect(await rules.after(yesterday)).toBe(false))

  it('fails with old date string', async () => expect(await rules.after('January, 2000')).toBe(false))

  it('fails with invalid value', async () => expect(await rules.after('')).toBe(false))
})

/**
 * Checks if a date is after another date
 */
describe('before', () => {
  const today = new Date()
  const tomorrow = new Date()
  const yesterday = new Date()
  tomorrow.setDate(today.getDate() + 1)
  yesterday.setDate(today.getDate() - 1)

  it('fails with tomorrow’s date object', async () => expect(await rules.before(tomorrow)).toBe(false))

  it('fails with future date', async () => expect(await rules.before('January 15, 2999')).toBe(false))

  it('fails with long past date', async () => expect(await rules.before(yesterday, 'Jan 15, 2000')).toBe(false))

  it('passes with yesterday’s date', async () => expect(await rules.before(yesterday)).toBe(true))

  it('passes with old date string', async () => expect(await rules.before('January, 2000')).toBe(true))

  it('fails with invalid value', async () => expect(await rules.after('')).toBe(false))
})


/**
 * Checks if a date is after another date
 */
describe('alpha', () => {
  it('passes with simple string', async () => expect(await rules.alpha('abc')).toBe(true))

  it('passes with long string', async () => expect(await rules.alpha('lkashdflaosuihdfaisudgflakjsdbflasidufg')).toBe(true))

  it('passes with single character', async () => expect(await rules.alpha('z')).toBe(true))

  it('passes with accented character', async () => expect(await rules.alpha('jüstin')).toBe(true))

  it('passes with lots of accented characters', async () => expect(await rules.alpha('àáâäïíôöÆ')).toBe(true))

  it('passes with lots of accented characters if invalid set', async () => expect(await rules.alpha('àáâäïíôöÆ', 'russian')).toBe(true))

  it('fails with lots of accented characters if latin', async () => expect(await rules.alpha('àáâäïíôöÆ', 'latin')).toBe(false))

  it('fails with numbers', async () => expect(await rules.alpha('justin83')).toBe(false))

  it('fails with symbols', async () => expect(await rules.alpha('-justin')).toBe(false))
})

/**
 * Checks if a date is after another date
 */
describe('number', () => {
  it('passes with simple number string', async () => expect(await rules.number('123')).toBe(true))

  it('passes with simple number', async () => expect(await rules.number(19832461234)).toBe(true))

  it('passes with float', async () => expect(await rules.number(198.32464)).toBe(true))

  it('passes with decimal in string', async () => expect(await rules.number('567.23')).toBe(true))

  it('fails with comma in number string', async () => expect(await rules.number('123,456')).toBe(false))

  it('fails with alpha', async () => expect(await rules.number('123sdf')).toBe(false))
})

/**
 * Checks if a date alpha and numeric
 */
describe('alphanumeric', () => {
  it('passes with simple string', async () => expect(await rules.alphanumeric('567abc')).toBe(true))

  it('passes with long string', async () => expect(await rules.alphanumeric('lkashdfla234osuihdfaisudgflakjsdbfla567sidufg')).toBe(true))

  it('passes with single character', async () => expect(await rules.alphanumeric('z')).toBe(true))

  it('passes with accented character', async () => expect(await rules.alphanumeric('jüst56in')).toBe(true))

  it('passes with lots of accented characters', async () => expect(await rules.alphanumeric('àáâ7567567äïíôöÆ')).toBe(true))

  it('passes with lots of accented characters if invalid set', async () => expect(await rules.alphanumeric('123123àáâäï67íôöÆ', 'russian')).toBe(true))

  it('fails with lots of accented characters if latin', async () => expect(await rules.alphanumeric('àáâäï123123íôöÆ', 'latin')).toBe(false))

  it('fails with decimals in', async () => expect(await rules.alphanumeric('abcABC99.123')).toBe(false))
})

/**
 * Checks if between
 */
describe('between', () => {
  it('passes with simple number', async () => expect(await rules.between(5, 0, 10)).toBe(true))

  it('passes with simple number string', async () => expect(await rules.between('5', '0', '10')).toBe(true))

  it('passes with decimal number string', async () => expect(await rules.between('0.5', '0', '1')).toBe(true))

  it('passes with string length', async () => expect(await rules.between('abc', 2, 4)).toBe(true))

  it('fails with string length too long', async () => expect(await rules.between('abcdef', 2, 4)).toBe(false))

  it('fails with string length too short', async () => expect(await rules.between('abc', 3, 10)).toBe(false))

  it('fails with number to small', async () => expect(await rules.between(0, 3, 10)).toBe(false))

  it('fails with number to large', async () => expect(await rules.between(15, 3, 10)).toBe(false))
})

/**
 * Checks if email.
 *
 * Note: testing is light, regular expression used is here: http://jsfiddle.net/ghvj4gy9/embedded/result,js/
 */
describe('email', () => {
  it('passes normal email', async () => expect(await rules.email('dev+123@wearebraid.com')).toBe(true))

  it('passes numeric email', async () => expect(await rules.email('12345@google.com')).toBe(true))

  it('passes unicode email', async () => expect(await rules.email('àlphä@❤️.ly')).toBe(true))

  it('passes numeric with new tld', async () => expect(await rules.email('12345@google.photography')).toBe(true))

  it('fails string without tld', async () => expect(await rules.email('12345@localhost')).toBe(false))

  it('fails string without tld', async () => expect(await rules.email('12345@localhost')).toBe(false))

  it('fails string without invalid name', async () => expect(await rules.email('1*(123)2345@localhost')).toBe(false))
})

/**
 * Mime types.
 */
describe('mime', () => {
  it('passes basic image/jpeg stack', async () => {
    const fileUpload = new FileUpload({
      files: [ { type: 'image/jpeg' } ]
    })
    expect(await rules.mime(fileUpload, 'image/png', 'image/jpeg')).toBe(true)
  })

  it('passes when match is at begining of stack', async () => {
    const fileUpload = new FileUpload({
      files: [ { type: 'document/pdf' } ]
    })
    expect(await rules.mime(fileUpload, 'document/pdf')).toBe(true)
  })

  it('fails when not in stack', async () => {
    const fileUpload = new FileUpload({
      files: [ { type: 'application/json' } ]
    })
    expect(await rules.mime(fileUpload, 'image/png', 'image/jpeg')).toBe(false)
  })
})

/**
 * Minimum.
 */
describe('min', () => {
  it('passes when a number string', async () => expect(await rules.min('5', '5')).toBe(true))

  it('passes when a number', async () => expect(await rules.min(6, 5)).toBe(true))

  it('passes when a string length', async () => expect(await rules.min('foobar', '6')).toBe(true))

  it('passes when a array length', async () => expect(await rules.min(Array(6), '6')).toBe(true))

  it('passes when string is forced to value', async () => expect(await rules.min('bcd', 'aaa', 'value')).toBe(true))

  it('fails when string is forced to lesser value', async () => expect(await rules.min('a', 'b', 'value')).toBe(false))

  it('passes when a number is forced to length', async () => expect(await rules.min('000', 3, 'length')).toBe(true))

  it('fails when a number is forced to length', async () => expect(await rules.min('44', 3, 'length')).toBe(false))

  it('fails when a array length', async () => expect(await rules.min(Array(6), '7')).toBe(false))

  it('fails when a string length', async () => expect(await rules.min('bar', 4)).toBe(false))

  it('fails when a number', async () => expect(await rules.min(3, '7')).toBe(false))

})

/**
 * Maximum.
 */
describe('max', () => {
  it('passes when a number string', async () => expect(await rules.max('5', '5')).toBe(true))

  it('passes when a number', async () => expect(await rules.max(5, 6)).toBe(true))

  it('passes when a string length', async () => expect(await rules.max('foobar', '6')).toBe(true))

  it('passes when a array length', async () => expect(await rules.max(Array(6), '6')).toBe(true))

  it('passes when forced to validate on length', async () => expect(await rules.max(10, 3, 'length')).toBe(true))

  it('passes when forced to validate string on value', async () => expect(await rules.max('b', 'e', 'value')).toBe(true))

  it('fails when a array length', async () => expect(await rules.max(Array(6), '5')).toBe(false))

  it('fails when a string length', async () => expect(await rules.max('bar', 2)).toBe(false))

  it('fails when a number', async () => expect(await rules.max(10, '7')).toBe(false))

  it('fails when a number', async () => expect(await rules.max(10, '7')).toBe(false))

  it('fails when forced to validate on length', async () => expect(await rules.max(-10, '1', 'length')).toBe(false))
})

/**
 * Maximum.
 */
describe('not', () => {
  it('passes when a number string', async () => expect(await rules.not('5', '6')).toBe(true))

  it('passes when a number', async () => expect(await rules.not(1, 30)).toBe(true))

  it('passes when a string', async () => expect(await rules.not('abc', 'def')).toBe(true))

  it('fails when a shallow equal array', async () => expect(await rules.not(['abc'], ['abc'])).toBe(false))

  it('fails when a shallow equal object', async () => expect(await rules.not({a: 'abc'}, ['123'], {a: 'abc'})).toBe(false))

  it('fails when string is in stack', async () => expect(await rules.not('a', 'b', 'c', 'd', 'a', 'f')).toBe(false))
})
