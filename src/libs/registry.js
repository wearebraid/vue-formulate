/**
 * Component registry with inherent depth to handle complex nesting. This is
 * important for features such as grouped fields.
 */
class Registry {
  /**
   * Create a new registry of components.
   */
  constructor () {
    this.registry = new Map()
  }

  /**
   * Add an item to the registry.
   * @param {string|array} key
   * @param {vue} component
   */
  add (name, component) {
    this.registry.set(name, component)
    return this
  }

  /**
   * Remove an item from the registry.
   * @param {string} name
   */
  remove (name) {
    this.registry.delete(name)
    return this
  }

  /**
   * Check if the registry has the given key.
   * @param {string|array} key
   */
  has (key) {
    return this.registry.has(key)
  }

  /**
   * Map over the registry (recursively).
   * @param {function} callback
   */
  map (callback) {
    const value = {}
    this.registry.forEach((component, field) => Object.assign(value, { [field]: callback(component, field) }))
    return value
  }

  /**
   * Return the keys of the registry.
   */
  keys () {
    return Array.from(this.registry.keys())
  }

  /**
   * Reduce the registry.
   * @param {function} callback
   */
  reduce (callback, accumulator) {
    this.registry.forEach((component, field) => {
      accumulator = callback(accumulator, component, field)
    })
    return accumulator
  }
}

export default Registry
