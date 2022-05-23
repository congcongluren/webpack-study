const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');


const sourceCode = 'function ast(){}';
const ast = esprima.parse(sourceCode);

let indent = 0;
let padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
  enter(node){
    console.log(padding() + node.type + '进入');
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + '离开');
  }
})

// a = {
//   type: 'Program',
//   body:
//     [FunctionDeclaration {
//       type: 'FunctionDeclaration',
//       id: [Identifier],
//       params: [],
//       body: [BlockStatement],
//       generator: false,
//       expression: false,
//       async: false
//     }],
//   sourceType: 'script'
// }