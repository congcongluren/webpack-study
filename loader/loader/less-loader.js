const less = require('less');

function loader(source) {
  // 1把loader的执行，从同步变成异步
  // 2返回callback
  console.log(source, 'less');
  // let callback = this.async();
  let str;
  less.render(source, {
    filename: this.resource,
  }, (err, output) => {
    // callback(err, output.css);
    str = `module.exports = ${JSON.stringify(output.css)}`
  });

  return str;
}

module.exports = loader;