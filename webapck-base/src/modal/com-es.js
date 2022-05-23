var modules = {
  './src/title.js': (module) => {
    module.exports = {
      name: "title_name",
      age: "title_age"
    }
  }
}

var cache = {};
function require(moduleId) {
  if (cache[moduleId]) {
    return cache[moduleId].exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  }

  modules[moduleId](module, module.exports, require);

  return module.exports;
}

// 标记
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, {value: "Module"});
  Object.defineProperty(exports, '__esModule', {value: true});

}

require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));

// 定义属性
require.d = (exports, definition) => {
  for(let key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key]
    })
  }
}

// 获取默认导出
require.n = (exports) => {
  var getter = exports.__esModule? () => exports.default : () => exports;
  require.d(getter, {a: getter});
  return getter;
}

var exports = {};

require.r(exports);
let title = require('./src/title.js');
var title_default = require.n(title);
console.log(title_default());
console.log(title_default.a);
console.log(title.age);
