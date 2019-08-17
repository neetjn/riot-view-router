module.exports = {
  entry: {
    main: './src/core.js'
  },
  output: {
    filename: 'riot-view-router.js',
    library: 'Router',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: 'node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
