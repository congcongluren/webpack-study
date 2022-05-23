const types = require('@babel/types');
const visitor = {
  ImportDeclaration(nodePath, state) {
    const { node } = nodePath;
    // 获取导入的标识符
    const { specifiers } = node;
    // 获取参数
    const { libraryName, libraryDirectory = 'lib' } =state.opts;

    if ( node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0]) ){
      const declarations = specifiers.map(specifier => {
        const source = [libraryName, libraryDirectory, specifier.imported.name].filter(Boolean).join('/');
        return types.importDeclaration(
          [types.importDefaultSpecifier(specifier.local)],
          types.stringLiteral(source)
        )
      })
      nodePath.replaceWithMultiple(declarations);
    }
  }
}


module.exports = function () {
  return {
    visitor
  }
}