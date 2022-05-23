const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

function toUnixPath(path) {
  return path.replace(/\\/g, '/');
}

// 当前命令所在目录
const baseDir = toUnixPath(process.cwd());  // D:/zzg-stydu/webpack-study/4.flow

class Compilation {
  constructor(options) {
    this.options = options;
    this.modules = []; // 本次编译所有生产出来的模块
    this.chunks = []; // 本次编译产出的所有代码块 入口模块， 依赖模块打包到一起
    this.assets = {}; // 资源文件
    // 本次打包涉及了哪些文件，主要为了实现watch， 监听文件变化，文件变化重新编译
    this.fileDependencies = [];  // 入口文件绝对路径
  }

  build(callback) {
    // 5 根据 entry 找到入口
    let entry = [];
    if (typeof this.options.entry === 'string') {
      entry.name = this.options.entry;
    } else {
      entry = this.options.entry;
    }

    // 6 从入口文件出发，调用配置的规则， loader 等进行编译
    for(let entryName in entry) {
      // 入口名， 代码块的名称
      // d:/zzg-stydu/webpack-study/4.flow/src/entry1.js
      let entryFilePath = path.posix.join(baseDir, entry[entryName]); 
      this.fileDependencies.push(entryFilePath);
      // 6 从入口文件出发，调用配置的规则， loader 等进行编译
      let entryModule = this.buildModule(entryName, entryFilePath);
      this.modules.push(entryModule);
      
      // 8 把所有模块编译完成，根据依赖关系，组装成一个个 包含多个模块的 chunk ， 代码块
      let chunk = {
        name: entryName, // 代码块名称就是入口名称
        entryModule, // 此代码对应的入口模块对象
        modules: this.modules.filter(item => item.names.includes(entryName)), // 所有打包的模块，包好入口文件路径
      }

      this.chunks.push(chunk);
      // 9  把各个代码块 chunk 转换成一个一个的文件 asset  加入到输出列表
      this.chunks.forEach(chunk => {
        let fileName = this.options.output.filename.replace('[name]', chunk.name);
        this.assets[fileName] = getSource(chunk);
      });
    }
    callback(null, {
      chunks: this.chunks,
      modules: this.modules,
      assets: this.assets,
    }, this.fileDependencies);

  }

  buildModule(name, modulePath) {
    // 6 从入口文件出发，调用配置的规则， loader 等进行编译
    // 6.1 读取模块内容

    let sourceCode = fs.readFileSync(modulePath, 'utf8');

    // 返回一个模块对象，每个模块都会有个模块id，相对于根目录的相对路径
    let moduleId = './' + path.posix.relative(baseDir, modulePath); // 根据一个路径，找到另一个路径相对于它的 路径 ./src/entry1.js
    // name 一个模块对象属于哪些代码块，可能会属于多个代码块
    let module = {
      id: moduleId,
      names: [name],
      dependencies:[]
    };
    // 查找对应loader进行翻译转化
    let loaders = [];

    let { rules } = this.options.module;
    rules.forEach(rule => {
      let { test } = rule;
      // 模块规则匹配
      if (modulePath.match(test)) {
        loaders.push(...rule.use);
      }
    });

    // 自右向左对模块进行编译
    sourceCode = loaders.reduceRight((sourceCode,loader) => {
      return require(loader)(sourceCode);
    }, sourceCode);
    // 通过loader编译后的一定是js内容
    // 7 找出模块依赖的模块，递归，找到所有依赖的模块进行编译
    let ast = parser.parse(sourceCode, {
      sourceType: 'module'
    });

    traverse(ast, {
      CallExpression: (nodePath) => {
        const {node} = nodePath;
        // require 方法调用
        if (node.callee.name === "require") {
          // 获取依赖模块
          let depModuleName = node.arguments[0].value; // 获取第一个参数，就是路径名  ./title.js
          // 当前正在编译的模块所在的目录
          
          let dirname = path.posix.dirname(modulePath); // d:/zzg-stydu/webpack-study/4.flow/src/entry1.js => d:/zzg-stydu/webpack-study/4.flow/src
          // 获取依赖模块的绝对路径
          let depModulePath = path.posix.join(dirname, depModuleName); // d:/zzg-stydu/webpack-study/4.flow/src/title.js
          // 获取扩展名
          let extensions = this.options.resolve.extensions;
          // 尝试添加后缀，找到硬盘上有的文件
          depModulePath = tryExtensions(depModulePath, extensions);
          this.fileDependencies.push(depModulePath);
          // 获取依赖的模块id
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath); // './src/title.js'
          // 修改语法树，把依赖的模块改为依赖的模块id
          //  require('./title');    require('./src/title.js');
          node.arguments = [types.stringLiteral(depModuleId)];
          // 添加依赖
          module.dependencies.push({depModuleId, depModulePath});
        }
      }
    });

    // 生成一个新的代码
    let { code } = generator(ast);
    // 把转义后的源代码放到module.source属性上
    module._source = code;
    //7 找出模块依赖的模块，递归，找到所有依赖的模块进行编译
    module.dependencies.forEach(({depModuleId, depModulePath}) => {
      let existModule = this.modules.find(item => item.id === depModuleId);
      if (existModule) {
        existModule.names.push(name);
      } else {
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule)
      }
    })

    return module;
  }

}


function getSource(chunk) {
  let str = chunk.modules.map(
    (module) => `
    "${module.id}": (module) => {
      ${module._source}
    }`
  )
  console.log(str);
  return `
   (() => {
    var modules = {
      ${chunk.modules.map(
        (module) => `
        "${module.id}": (module) => {
          ${module._source}
        }`
      )}
    };
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    var exports ={};
    ${chunk.entryModule._source}
  })();
   `;
}

function tryExtensions(modulePath, extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  
  for (let i = 0; i < extensions.length; i++) {
    const filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  throw new Error(`无法找到路径${modulePath}`)
}

module.exports = Compilation;