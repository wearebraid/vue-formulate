export default {
  inheritAttrs: false,
  functional: true,
  render (h, { props, data, parent, children }) {
    var p = parent
    while (p && p.$options.name !== 'FormulateInput') {
      p = p.$parent
    }
    if (p.$scopedSlots && p.$scopedSlots[props.name]) {
      return p.$scopedSlots[props.name](props)
    }
    return h('div', data, children)
  }
}
