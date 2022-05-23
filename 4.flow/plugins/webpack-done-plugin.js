class WebpackDonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap('webpackDonePlugin', () => {
      console.log('结束编译', this.options);
    })
  }
}

module.exports = WebpackDonePlugin;