function loader(source) {
  console.log('//loader2');
  return source + '//loader2'
}

module.exports = loader