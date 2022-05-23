const core = require('@babel/core');
const types = require('@babel/types');
// const transformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');

var sourceCode = `
const sum = (a,b) => {
  console.log(this);
  return a + b;
};
`;
sourceCode = `
const sum = (a,b) =>  a + b;
`;

const transformEs2015ArrowFunctions = {
  visitor: {
    ArrowFunctionExpression(path) {
      let { node } = path;
      hoistFunctionEnvironment(path);
      node.type = 'FunctionDeclaration';
      let body = node.body;
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    }
  }
}

function hoistFunctionEnvironment(path) {
  // 确定哪里的this 向上找不是箭头函数的函数或者根节点
  const thisEnv = path.findParent(parent => {
    return (parent.isFunction() && !path.isArrowFunctionExpression()) || parent.isProgram();
  });

  let thisBindings = '_this';
  let thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    // 在thisenv 的作用域上添加一个变量，变量名为_this
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      thisEnv.scope.push({
        id: types.identifier(thisBindings),
        init: types.thisExpression()
      })
    }
  }


  thisPaths.forEach(thisPath => {
    // 替换this
    thisPath.replaceWith(types.identifier(thisBindings));
  })
}

function getThisPaths(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    }
  })
  return thisPaths;
}

const tcode = core.transform(sourceCode, {
  plugins: [transformEs2015ArrowFunctions]
})


console.log(tcode.code);