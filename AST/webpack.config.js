const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './2.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    open: true
  },

  plugins:[
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["**/*"]}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}