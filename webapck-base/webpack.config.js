const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'main.js',
    publicPath: '/'
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    open: true
  },

  plugins:[
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}