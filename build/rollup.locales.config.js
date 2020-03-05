import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import { terser } from 'rollup-plugin-terser'

export default {
  output: {
    dir: 'dist/locales',
    format: 'umd'
  },
  plugins: [
    buble({
      objectAssign: 'Object.assign'
    }), // Transpile to ES5,
    terser()
  ]
}
