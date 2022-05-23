const core = require('@babel/core');
const types = require('@babel/types');

let transformClassPlugin = {
  visitor: {

    ClassDeclaration(nodePath) {
      const { node } = nodePath;
      const id = node.id;
      const classMethods = node.body.body;
      let nodes = [];
      classMethods.forEach(method => {
        if (method.kind === 'constructor') {
          const constructorFunction = types.functionDeclaration(id, method.params, method.body, method.generator, method.async);
          nodes.push(constructorFunction);
        } else {
          const left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')),
            method.key);
          const right = types.functionExpression(method.id, method.params, method.body, method.generator, method.async);
          const assignmentExpression = types.assignmentExpression('=', left, right);
          nodes.push(assignmentExpression);
        }
      })

      nodePath.replaceWithMultiple(nodes);
    }
  }

}

const sourceCode = `
  class Person {
    constructor(name) {
      this.name = name;
    }

    getName() {
      return this.name;
    }
  }
`;


let tcode = core.transform(sourceCode, {
  plugins: [transformClassPlugin]
})

console.log(tcode.code);
// function Person(name) {
//   this.name = name;
// }
// Person.prototype.getName = () => {
//   return this.name;
// }