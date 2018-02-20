const path = require('path')

module.exports = {
  target: 'node'
, entry: {
    'parse-favicon': './src/parse-favicon.js'
  , 'cli': './src/cli.js'
  }
, output: {
    path: path.join(__dirname, 'lib')
  , filename: '[name].js'
  , library: 'parseFavicon'
  , libraryTarget: 'umd'
  }
, module: {
    rules: [
      {
        test: /\.js$/
      , exclude: /node_module/
      , use: 'babel-loader'
      }
    ]
  }
}
