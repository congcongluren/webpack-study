const webpack = require('./webpack2.js');
const webpackOptions= require('./webpack.config.js');
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  // console.log(err);
  // console.log(stats.toJson({
  //   assets: true, // 产出的资源 
  //   chunks: true, // 产出的代码块
  //   modules: true // 产出的模块
  // }));
})