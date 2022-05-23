const Compiler = require('./Compiler');

function webpack(options) {
  // - 初始化参数  合并配置文件
  const argv = process.argv.slice(2);
  let shellOptions = argv.reduce((shellOptions, options) => {
    let [key, value] = options.split('=');
    shellOptions[key.slice(2)] = value;
    return shellOptions;
  }, {});
  let finalOptions = {...options, ...shellOptions};
  // 用上一步初始化对象cmpiler 
  const compiler = new Compiler(finalOptions);
  // 加载所有在配置文件中的插件
  const { plugins } = finalOptions;
  for(let plugin of plugins) {
    plugin.apply(compiler);
  }
  return compiler
}


module.exports = webpack;