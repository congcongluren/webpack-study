const { SyncHook } = require('tapable');
const Compilation = require('./Compilation');
const fs = require('fs');
const path = require('path');

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 编译开始
      done: new SyncHook(), // 编译结束
    }
  }

  // 4. 执行 complier 对象 run 方法开始编译
  run(callback) {
    this.hooks.run.call();
    // 编译成功回调
    const onCompiled = (err, stats, fileDependencies) => {
      // 10 确定好输出内容，根据输出路径，文件名，把文件写道文件系统里
      for(let filename in stats.assets) {
        let filePath = path.join(this.options.output.path, filename);
        let exist = fs.existsSync(path.dirname(filePath));
        if (!exist)  {
          fs.mkdirSync(path.dirname(filePath));
        }
        fs.writeFileSync(filePath, stats.assets[filename], 'utf8');
      }
      callback(err, {
        toJson: () => stats
      })
      fileDependencies.forEach((fileDependency) => {
        fs.watch(fileDependency, () => {
          this.compiler(onCompiled)
        })
      });
      // 成功后done 回调
      this.hooks.done.call();
    }
    // 开始编译，成功后回调 onCompiled
    this.compiler(onCompiled);
  }

  compiler(callback) {
    // 只有一个 compiler  但是都会产生一个新的compilation
    let compilation = new Compilation(this.options);
    compilation.build(callback);
  }
}

module.exports = Compiler;