function loader(source) {
  console.log(source, '--loader1');
  return source + '//loader1'
}

module.exports = loader