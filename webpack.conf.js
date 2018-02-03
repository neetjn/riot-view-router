const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/core.js',
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: 'dist/',
    filename: 'riot-view-router.js',
    libraryTarget: 'umd',
    library: 'Router',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['env'],
            plugins: ['add-module-exports']
          }
        }
      }
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.filename = 'riot-view-router.min.js'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
