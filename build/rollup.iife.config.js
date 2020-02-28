import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs' // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import internal from 'rollup-plugin-internal'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/Formulate.js', // Path relative to package.json
  output: {
    name: 'Formulate',
    exports: 'named',
    globals: {
      'is-plain-object': 'isPlainObject',
      'nanoid': 'nanoid',
      'is-url': 'isUrl',
      'crypto': 'crypto'
    }
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    internal(['is-plain-object', 'nanoid', 'is-url', 'crypto']),
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
