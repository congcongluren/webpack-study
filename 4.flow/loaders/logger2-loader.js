function loader(source) {
  console.log(source, '--loader2');
  return source + '//loader2'
}

module.exports = loader