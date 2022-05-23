const path = require('path');
const webpackRunPlugin = require('./plugins/webpack-run-plugin');
const webpackDonePlugin = require('./plugins/webpack-done-plugin');

module.exports = {
  mode: 'development',
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders/logger1-loader.js'),
          path.resolve(__dirname, 'loaders/logger2-loader.js'),
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     path.resolve(__dirname, 'loaders/style-loader.js'),
      //   ]
      // }
    ]
  },
  plugins:[
    new webpackRunPlugin({
      message: '消息'
    }),
    new webpackDonePlugin({
      message: '消息'
    })
  ]
}