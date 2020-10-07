/**
 * Given an object and an index, complete an object for schema-generation.
 * @param {object} item
 * @param {int} index
 */
export function leaf (item, index) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const { children = null, component = 'FormulateInput', depth = 1, ...attrs } = item
    // these next two lines are required since `class` is a keyword and should
    // not be used in rest/spread operators.
    const cls = attrs.class || {}
    delete attrs.class

    const type = component === 'FormulateInput' ? (attrs.type || 'text') : ''
    const name = attrs.name || type || 'el'
    const key = attrs.id || `${name}-${depth}-${index}`
    const els = Array.isArray(children)
      ? children.map(child => Object.assign(child, { depth: depth + 1 }))
      : children
    return Object.assign({ key, depth, attrs, component, class: cls }, els ? { children: els } : {})
  }
  return null
}

/**
 * Recursive function to create vNodes from a schema.
 * @param {Functon} h createElement
 * @param {Array|string} schema
 */
function tree (h, schema) {
  if (Array.isArray(schema)) {
    return schema.map((el, index) => {
      const item = leaf(el, index)
      return h(
        item.component,
        { attrs: item.attrs, class: item.class, key: item.key },
        item.children ? tree(h, item.children) : null
      )
    })
  }
  return schema
}

export default {
  functional: true,
  render: (h, { props }) => tree(h, props.schema)
}
