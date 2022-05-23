var modules = {};
var cache = {};
function require(moduleId) {
  console.log(arguments);
  if (cache[moduleId]) {
    return cache[moduleId].exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  }

  modules[moduleId](module, module.exports, require);

  return module.exports;
}
/**
 * 
 * @param {*} chunkIds 代码块的id数组
 * @param {*} moreModules 额外的模块定义
 */
function webpacJsonCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkIds][0]);
    installedChunks[chunkId] = 0; // 代码块下载完成
  }

  // 合并模块到modules去
  for(let moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }

  // 执行成功调用方法
  while(resolves.length) {
    resolves.shift()();
  }
}

// 加载代码块的状态
// key 代码块的名字
// 0 表示加载完成
var installedChunks = {
  "main": 0,
  // hello : [resolve, reject, promise]
}

// 定义一个m属性，执行模块定义对象
require.m = modules;
require.f={};
// 返回文件对应的 publicPath
require.p = "";
/**
 * 返回此代码块对应的路径名
 * @param {*} chunkId 
 * @returns 
 */
require.u = function(chunkId) {
  return "" + chunkId + '.main.js'
}

// biaoji
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, {value: "Module"});
  Object.defineProperty(exports, '__esModule', {value: true});

}

// dingyishuxing
require.d = (exports, definition) => {
  for(let key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key]
    })
  }
}


/**
 * 通过jsonp 加载模块文件
 * 返回promise
 * @param {*} chunkId 
 * @param {*} promises 
 */
require.f.j = function(chunkId, promises) {
  // 当前的代码块的数据
  let installedChunkData;
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  })
  installedChunkData.push(promise);
  promises.push(installedChunkData[2] = promise);
  const url = require.p + require.u(chunkId);
  require.l(url);
}

/**
 * 
 */
require.l = function(url) {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);

}

require.e = function (chunkId){
  let promises = [];

  require.f.j(chunkId, promises);
  return Promise.all(promises)
}

var chunkLoadingGlobal = window['webpack'] = [];
chunkLoadingGlobal.push = webpacJsonCallback;
require.e('hello').then(require.bind(require, './src/hello.js')).then(result => {
  console.log(result);
});