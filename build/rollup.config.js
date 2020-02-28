import autoExternal from 'rollup-plugin-auto-external'
import commonjs from 'rollup-plugin-commonjs' // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/Formulate.js', // Path relative to package.json
  output: {
    name: 'Formulate',
    exports: 'named',
    globals: {
      'is-plain-object': 'isPlainObject',
      'nanoid/non-secure': 'nanoid',
      'is-url': 'isUrl'
    }
  },
  external: ['nanoid/non-secure'],
  plugins: [
    commonjs(),
    autoExternal(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({
      objectAssign: 'Object.assign'
    }), // Transpile to ES5,
    terser()
  ]
}
