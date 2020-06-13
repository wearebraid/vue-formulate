import { createItem } from './libs/utils'

function renderSchema (h, schema) {
  return schema.map(leaf => {
    const item = createItem(leaf)
    return h(
      item.component,
      { attrs: item.attrs },
      item.children ? renderSchema(h, item.children) : null
    )
  })
}

export default {
  functional: true,
  render: (h, { props }) => renderSchema(h, props.schema)
}
