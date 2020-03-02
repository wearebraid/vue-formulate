import { sentence as s } from '../libs/utils'
/**
 * Validation error message generators.
 */
export default {

  /**
   * Valid accepted value.
   */
  accepted: function ({ name }) {
    return `Merci d'accepter les ${name}.`
  },

  /**
   * The date is not after.
   */
  after: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} doit être postérieur à ${args[0]}.`
    }
    return `${s(name)} doit être une date ultérieure.`
  },

  /**
   * The value is not a letter.
   */
  alpha: function ({ name }) {
    return `${s(name)} peut uniquement contenir des lettres.`
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function ({ name }) {
    return `${s(name)} peut uniquement contenir des lettres ou des chiffres`
  },

  /**
   * The date is not before.
   */
  before: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} doit être antérieur à ${args[0]}.`
    }
    return `${s(name)} doit être une date antérieure.`
  },

  /**
   * The value is not between two numbers or lengths
   */
  between: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${s(name)} doit être compris entre ${args[0]} et ${args[1]}.`
    }
    return `${s(name)} doit être compris entre ${args[0]} et ${args[1]} caractères.`
  },

  /**
   * The confirmation field does not match
   */
  confirm: function ({ name, args }) {
    return `${s(name)} ne correspond pas.`
  },

  /**
   * Is not a valid date.
   */
  date: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} n'est pas valide.  Merci d'utiliser le format ${args[0]}`
    }
    return `${s(name)} n'est pas une date valide.`
  },

  /**
   * The default render method for error messages.
   */
  default: function ({ name }) {
    return `This field isn’t valid.`
  },

  /**
   * Is not a valid email address.
   */
  email: function ({ name, value }) {
    if (!value) {
      return 'Merci d\'entrer une addresse email valide.'
    }
    return `“${value}” n'est pas une adresse email valide.`
  },

  /**
   * Value is an allowed value.
   */
  in: function ({ name, value }) {
    if (typeof value === 'string' && value) {
      return `“${s(value)}” n'est pas un(e) ${name} autorisé(e).`
    }
    return `Cette valeur n'est pas un(e) ${name} autorisé(e).`
  },

  /**
   * Value is not a match.
   */
  matches: function ({ name }) {
    return `${s(name)} n'est pas une valeur autorisée.`
  },

  /**
   * The maximum value allowed.
   */
  max: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Vous pouvez uniquement sélectionner ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} doit être inférieur ou égal à ${args[0]}.`
    }
    return `${s(name)} doit être inférieur ou égal à ${args[0]} caractères.`
  },

  /**
   * The (field-level) error message for mime errors.
   */
  mime: function ({ name, args }) {
    return `${s(name)} doit être de type: ${args[0] || 'Aucun format autorisé.'}`
  },

  /**
   * The maximum value allowed.
   */
  min: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Vous devez sélectionner au moins ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} doit être supérieur à ${args[0]}.`
    }
    return `${s(name)} doit être plus long que ${args[0]} caractères.`
  },

  /**
   * The field is not an allowed value
   */
  not: function ({ name, value }) {
    return `“${value}” is not an allowed ${name}.`
  },

  /**
   * The field is not a number
   */
  number: function ({ name }) {
    return `${s(name)} doit être un nombre.`
  },

  /**
   * Required field.
   */
  required: function ({ name }) {
    return `${s(name)} est obligatoire.`
  },

  /**
   * Value is not a url.
   */
  url: function ({ name }) {
    return `Merci d'entrer une URL valide.`
  }
}
