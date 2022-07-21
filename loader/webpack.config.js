const path = require('path');


module.exports = {
  mode: 'development',
  devtool: false,
  // mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolveLoader: {
    alias: {
      'babel-loader': path.resolve(__dirname, 'loader/babel-loader.js')
    },
    modules: [path.resolve('./loader'), 'node_modules']
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
      }
    ]
  }
}

/**
 * 使用自定义loader
 *  1 loader 使用绝对路径引入
 *  2 resolveLoader 配置 alias
 *  3 resolveLoader 配置 modules
*/