import { sentence as s } from '../libs/utils'
/**
 * Validation error message generators.
 */
export default {

  /**
   * Valid accepted value.
   */
  accepted: function ({ name }) {
    return `Accepter venligst ${name}.`
  },

  /**
   * The date is not after.
   */
  after: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} skal være efter ${args[0]}.`
    }
    return `${s(name)} skal være en senere dato.`
  },

  /**
   * The value is not a letter.
   */
  alpha: function ({ name }) {
    return `${s(name)} kan kun indeholde bogstaver.`
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function ({ name }) {
    return `${s(name)} kan kun indeholde bogstaver og tal.`
  },

  /**
   * The date is not before.
   */
  before: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} skal være før ${args[0]}.`
    }
    return `${s(name)} skal være en tidligere dato.`
  },

  /**
   * The value is not between two numbers or lengths
   */
  between: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${s(name)} skal være mellem ${args[0]} og ${args[1]}.`
    }
    return `${s(name)} skal være mellem ${args[0]} og ${args[1]} tegn.`
  },

  /**
   * The confirmation field does not match
   */
  confirm: function ({ name, args }) {
    return `${s(name)} matcher ikke.`
  },

  /**
   * Is not a valid date.
   */
  date: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} er ikke gyldig, brug venligst formatet ${args[0]}`
    }
    return `${s(name)} er ikke en gyldig dato.`
  },

  /**
   * The default render method for error messages.
   */
  default: function ({ name }) {
    return `Dette felt er ikke gyldigt.`
  },

  /**
   * Is not a valid email address.
   */
  email: function ({ name, value }) {
    if (!value) {
      return 'Indtast venligst en gyldig email-adresse.'
    }
    return `“${value}” er ikke en gyldig email-adresse.`
  },

  /**
   * Ends with specified value
   */
  endsWith: function ({ name, value }) {
    if (!value) {
      return `Dette felt slutter ikke med en gyldig værdi.`
    }
    return `“${value}” slutter ikke med en gyldig værdi.`
  },

  /**
   * Value is an allowed value.
   */
  in: function ({ name, value }) {
    if (typeof value === 'string' && value) {
      return `“${s(value)}” er ikke en tilladt ${name}.`
    }
    return `Dette er ikke en tilladt ${name}.`
  },

  /**
   * Value is not a match.
   */
  matches: function ({ name }) {
    return `${s(name)} er ikke en gyldig værdi.`
  },

  /**
   * The maximum value allowed.
   */
  max: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Du kan kun vælge ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} skal være mindre end eller lig ${args[0]}.`
    }
    return `${s(name)} skal være mindre end eller lig ${args[0]} tegn.`
  },

  /**
   * The (field-level) error message for mime errors.
   */
  mime: function ({ name, args }) {
    return `${s(name)} skal være af typen: ${args[0] || 'Ingen tilladte filformater.'}`
  },

  /**
   * The maximum value allowed.
   */
  min: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Du skal vælge mindst ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} skal være mere end ${args[0]}.`
    }
    return `${s(name)} skal være mere end ${args[0]} tegn.`
  },

  /**
   * The field is not an allowed value
   */
  not: function ({ name, value }) {
    return `“${value}” er ikke en gyldig ${name}.`
  },

  /**
   * The field is not a number
   */
  number: function ({ name }) {
    return `${s(name)} skal være et tal.`
  },

  /**
   * Required field.
   */
  required: function ({ name }) {
    return `${s(name)} er påkrævet.`
  },

  /**
   * Starts with specified value
   */
  startsWith: function ({ name, value }) {
    if (!value) {
      return `Dette felt starter ikke med en gyldig værdi.`
    }
    return `“${value}” starter ikke med en gyldig værdi.`
  },

  /**
   * Value is not a url.
   */
  url: function ({ name }) {
    return `Indtast venligst en gyldig URL.`
  }
}
