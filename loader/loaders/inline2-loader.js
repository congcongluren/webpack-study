function loader(source) {
  console.log('--inline2');
  return source + '//inline2';
}


loader.pitch = function (params) {
  console.log("inlin2-pitch");

  // return "inlin2-result";
}

module.exports = loader;