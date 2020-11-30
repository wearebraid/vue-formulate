import { cyrb43 } from './libs/utils'

/**
 * Given an object and an index, complete an object for schema-generation.
 * @param {object} item
 * @param {int} index
 */
export function leaf (item, index = 0) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    let { children = null, component = 'FormulateInput', depth = 1, key = null, ...attrs } = item
    // these next two lines are required since `class` is a keyword and should
    // not be used in rest/spread operators.
    const cls = attrs.class || {}
    delete attrs.class

    const type = component === 'FormulateInput' ? (attrs.type || 'text') : component
    const name = attrs.name || type || 'el'
    if (!key) {
      // We need to generate a unique key if at all possible
      if (attrs.id) {
        // We've been given an id, so we should use it.
        key = attrs.id
      } else if (component !== 'FormulateInput' && typeof children === 'string') {
        // This is a simple text node container.
        key = `${type}-${cyrb43(children)}`
      } else {
        // This is a wrapper element
        key = `${type}-${name}-${depth}${attrs.name ? '' : '-' + index}`
      }
    }
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
