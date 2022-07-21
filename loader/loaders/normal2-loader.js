function loader(source) {
  console.log('--normal2');
  return source + '//normal2';
}


loader.pitch = function (params) {
  console.log("normal2-pitch");
}

module.exports = loader;