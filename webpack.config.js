const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.resolve(`${__dirname}/src/formulate.js`),
  output: {
    path: path.resolve(`${__dirname}/dist/`),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'vue-formulate',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      mangle: true,
      compress: {
        warnings: false
      }
    })
  ]
}
