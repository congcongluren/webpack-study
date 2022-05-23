var modules = {
  './src/title.js': function(module, exports, require) {
    require.r(exports);
    require.d(exports, {
      default: () =>  DEFAULT_EXPORT,
      age: () => age
    });

    const DEFAULT_EXPORT = 'titel_name';
    const age = 'title_age';
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


let title = require('./src/title.js');

console.log(title);