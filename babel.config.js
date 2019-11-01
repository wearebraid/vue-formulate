module.exports = {
  env: {
    testing: {
      presets: [
        [ '@babel/preset-env', {
          targets: {
            node: '9'
          }
        } ]
      ]
    }
  }
}
