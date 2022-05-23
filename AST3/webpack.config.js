const path = require('path');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                path.resolve(__dirname, 'plugins/babel-plugin-import.js'),
                {
                  libraryName:'lodash',
                  libraryDirectory: ''
                }
              ],
              [
                path.resolve(__dirname, 'plugins/babel-logger')
              ]
            ]
          }
        }
      }
    ]
  }
}