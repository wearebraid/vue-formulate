import path from 'path'

export default function nuxtVueFormulate (moduleOptions) {
  const formulateOptions = Object.assign({}, this.options.formulate, moduleOptions)
  // Register `plugin.js` template
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: formulateOptions
  })
}
