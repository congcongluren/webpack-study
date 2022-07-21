function loader(source) {
  console.log('--post2');
  // 如何让loader的执行变成异步
  let callback = this.async();
  setTimeout(() => {
    callback(null, source + '//post22')
  }, 3000);

  return source + '//post2';
}

loader.pitch = function (params) {
  console.log("post2-pitch");
}

module.exports = loader;