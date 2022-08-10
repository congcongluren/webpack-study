const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  // mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolveLoader: {
    alias: {
      'babel-loader': path.resolve(__dirname, 'loader/babel-loader.js'),
      'style-loader': path.resolve(__dirname, 'loader/style-loader.js'),
      'less-loader': path.resolve(__dirname, 'loader/less-loader.js'),
    },
    // modules: [path.resolve('./loader'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: path.resolve(__dirname, 'loader/babel-loader.js'),
          // loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}

/**
 * 使用自定义loader
 *  1 loader 使用绝对路径引入
 *  2 resolveLoader 配置 alias
 *  3 resolveLoader 配置 modules
*/