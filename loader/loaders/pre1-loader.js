function loader(source) {
  console.log('--pre1');
  return source + '//pre1';
}

loader.pitch = function (params) {
  console.log("pre1-pitch");
}


module.exports = loader;