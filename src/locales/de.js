import { sentence as s } from '../libs/utils'
/**
 * Validation error message generators.
 */
export default {

  /**
   * Valid accepted value.
   */
  accepted: function ({ name }) {
    return `Sie müssen ${name} zustimmen.`
  },

  /**
   * The date is not after.
   */
  after: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} muss auf ${args[0]} folgen.`
    }
    return `${s(name)} muss ein späteres Datum sein.`
  },

  /**
   * The value is not a letter.
   */
  alpha: function ({ name }) {
    return `${s(name)} darf nur Buchstaben enthalten.`
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function ({ name }) {
    return `${s(name)} darf nur Buchstaben und Zahlen enthalten.`
  },

  /**
   * The date is not before.
   */
  before: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} muss vor ${args[0]} sein.`
    }
    return `${s(name)} muss ein früheres Datum sein.`
  },

  /**
   * The value is not between two numbers or lengths
   */
  between: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${s(name)} muss zwischen ${args[0]} und ${args[1]}.`
    }
    return `${s(name)} muss zwischen ${args[0]} und ${args[1]} Zeichen lang sein.`
  },

  /**
   * The confirmation field does not match
   */
  confirm: function ({ name, args }) {
    return `${s(name)} stimmt nicht überein.`
  },

  /**
   * Is not a valid date.
   */
  date: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} ist nicht korrekt, bitte das Format ${args[0]} benutzen.`
    }
    return `${s(name)} ist kein gültiges Datum.`
  },

  /**
   * The default render method for error messages.
   */
  default: function ({ name }) {
    return `Das Feld hat einen Fehler.`
  },

  /**
   * Is not a valid email address.
   */
  email: function ({ name, value }) {
    if (!value) {
      return 'Bitte eine gültige E-Mail-Adresse eingeben.'
    }
    return `“${value}” ist keine gültige E-Mail-Adresse.`
  },

  /**
   * Value is an allowed value.
   */
  in: function ({ name, value }) {
    if (typeof value === 'string' && value) {
      return `“${s(value)}” ist kein gültiger Wert für ${name}.`
    }
    return `Dies ist kein gültiger Wert für ${name}.`
  },

  /**
   * Value is not a match.
   */
  matches: function ({ name }) {
    return `${s(name)} ist kein gültiger Wert.`
  },

  /**
   * The maximum value allowed.
   */
  max: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Es dürfen nur ${args[0]} ${name} ausgewählt werden.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} muss kleiner oder gleich ${args[0]} sein.`
    }
    return `${s(name)} muss ${args[0]} oder weniger Zeichen lang sein.`
  },

  /**
   * The (field-level) error message for mime errors.
   */
  mime: function ({ name, args }) {
    return `${s(name)} muss den Typ ${args[0] || 'Keine Dateien erlaubt'} haben.`
  },

  /**
   * The maximum value allowed.
   */
  min: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Es müssen mindestens ${args[0]} ${name} ausgewählt werden.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} muss größer als ${args[0]} sein.`
    }
    return `${s(name)} must ${args[0]} oder mehr Zeichen lang sein.`
  },

  /**
   * The field is not an allowed value
   */
  not: function ({ name, value }) {
    return `“${value}” ist kein erlaubter Wert für ${name}.`
  },

  /**
   * The field is not a number
   */
  number: function ({ name }) {
    return `${s(name)} muss eine Zahl sein.`
  },

  /**
   * Required field.
   */
  required: function ({ name }) {
    return `${s(name)} ist ein Pflichtfeld.`
  },

  /**
   * Value is not a url.
   */
  url: function ({ name }) {
    return `${s(name)} muss eine gültige URL sein.`
  }
}


