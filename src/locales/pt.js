import { sentence as s } from '../libs/utils'
/**
 * Validation error message generators.
 */
export default {

  /**
   * Valid accepted value.
   */
  accepted: function ({ name }) {
    return `Por favor aceite o ${name}.`
  },

  /**
   * The date is not after.
   */
  after: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} deve ser posterior a ${args[0]}.`
    }
    return `${s(name)} deve ser uma data posterior.`
  },

  /**
   * The value is not a letter.
   */
  alpha: function ({ name }) {
    return `${s(name)} pode conter apenas letras.`
  },

  /**
   * Rule: checks if the value is alpha numeric
   */
  alphanumeric: function ({ name }) {
    return `${s(name)} pode conter apenas letras e números.`
  },

  /**
   * The date is not before.
   */
  before: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} deve ser antes de ${args[0]}.`
    }
    return `${s(name)} deve ser uma data anterior.`
  },

  /**
   * The value is not between two numbers or lengths
   */
  between: function ({ name, value, args }) {
    if (!isNaN(value)) {
      return `${s(name)} deve ser entre ${args[0]} e ${args[1]}.`
    }
    return `${s(name)} deve ter entre ${args[0]} e ${args[1]} caracteres.`
  },

  /**
   * The confirmation field does not match
   */
  confirm: function ({ name, args }) {
    return `${s(name)} não corresponde.`
  },

  /**
   * Is not a valid date.
   */
  date: function ({ name, args }) {
    if (Array.isArray(args) && args.length) {
      return `${s(name)} não é válido, por favor use o formato ${args[0]}`
    }
    return `${s(name)} não é uma data válida.`
  },

  /**
   * The default render method for error messages.
   */
  default: function ({ name }) {
    return `Esse campo não é válido.`
  },

  /**
   * Is not a valid email address.
   */
  email: function ({ name, value }) {
    if (!value) {
      return 'Por favor informe um e-mail válido.'
    }
    return `“${value}” não é um e-mail válido.`
  },

  /**
   * Value is an allowed value.
   */
  in: function ({ name, value }) {
    if (typeof value === 'string' && value) {
      return `“${s(value)}” não é um ${name} permitido.`
    }
    return `Isso não é um ${name} permitido.`
  },

  /**
   * Value is not a match.
   */
  matches: function ({ name }) {
    return `${s(name)} não é um valor válido.`
  },

  /**
   * The maximum value allowed.
   */
  max: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Você deve selecionar apenas ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} deve ser menor ou igual a ${args[0]}.`
    }
    return `${s(name)} deve ter no máximo ${args[0]} caracteres.`
  },

  /**
   * The (field-level) error message for mime errors.
   */
  mime: function ({ name, args }) {
    return `${s(name)} deve ser no formato: ${args[0] || 'Formato de arquivo não permitido.'}`
  },

  /**
   * The maximum value allowed.
   */
  min: function ({ name, value, args }) {
    if (Array.isArray(value)) {
      return `Você deve selecionar pelo menos ${args[0]} ${name}.`
    }
    const force = Array.isArray(args) && args[1] ? args[1] : false
    if ((!isNaN(value) && force !== 'length') || force === 'value') {
      return `${s(name)} deve ser maior que ${args[0]}.`
    }
    return `${s(name)} deve ter mais de ${args[0]} caracteres.`
  },

  /**
   * The field is not an allowed value
   */
  not: function ({ name, value }) {
    return `“${value}” não é um ${name} válido.`
  },

  /**
   * The field is not a number
   */
  number: function ({ name }) {
    return `${s(name)} deve ser um número.`
  },

  /**
   * Required field.
   */
  required: function ({ name }) {
    return `${s(name)} é obrigatório.`
  },

  /**
   * Value is not a url.
   */
  url: function ({ name }) {
    return `Por favor informe uma URL válida.`
  }
}
