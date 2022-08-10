const core = require('@babel/core');
function loader(source, inputSourceMap) {
  // this 是loader函数的this指针, loadercontext 对象
  const options = this.getOptions();
  const loaderOptions = {
    ...options,
    inputSourceMap,
    sourceMaps: true,
    filename: this.resourcePath
  };
  // code 转义后的代码  源代码，转义后的代码，映射文件  抽象语法树
  let {code, map, ast} = core.transform(source, loaderOptions);

  this.callback(null, code, map, ast);

  // console.log("bable-loader");
  // return source;
}

loader.pitch = function (params) {
  
} 

module.exports = loader;

/**
 * babel-loader 只是提供一个转换函数，但是不知道具体做什么
 * babel/core 负责把源码转换成 ast，然后遍历 ast，重新生成新的代码
 * 
 * @babel/transform-arrow-functions 知道怎么转换箭头函数
 * 
 * preset-env是个预设的集合
*/