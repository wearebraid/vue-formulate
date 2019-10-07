export default {
  /**
   * Validate a required field.
   * @param {Object} field
   * @param {string} label
   */
  async required ({value, error}) {
    return (!value || (Array.isArray(value) && !value.length)) ? error(...arguments) : false
  },

  /**
   *  Validates the field contains only numbers
   * @param {Object} field
   * @param {string} label
   */
  async number ({value, error}) {
    return isNaN(value) ? error(...arguments) : false
  },

  /**
   * Validate email addresses
   * @param {Object} field
   * @param {string} label
   */
  async email ({value, error}) {
    // eslint-disable-next-line
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return (value && !re.test(value.toLowerCase())) ? error(...arguments) : false
  },

  /**
   * Check if a particular field is matches another field in the form.
   * @param {Object} field
   * @param {string} label
   * @param {string} confirmField (uses `${field}_confirmation` by default)
   */
  async confirmed ({field, value, error, values}, confirmField) {
    confirmField = confirmField || `${field}_confirmation`
    return (value && value !== values[confirmField]) ? error(...arguments) : false
  }
}
