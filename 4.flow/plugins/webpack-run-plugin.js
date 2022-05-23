class WebpackRunPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.run.tap('webpackRunPlugin', () => {
      console.log('开始编译', this.options);
    })
  }
}

module.exports = WebpackRunPlugin;