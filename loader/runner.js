const { runLoaders } = require('loader-runner');
const path = require('path');
const fs = require('fs');

// 将要转换的文件绝对路径
const entryFile = path.resolve(__dirname, 'src/index.js');
let request = `inline1-loader!inline2-loader!${entryFile}`;
// 叠加顺序  post 后置    inline 内联    normal 正常    pre 前置


let rules = [
  {
    test: /\.js/,
    use:['normal1-loader', 'normal2-loader']
  },
  {
    test: /\.js/,
    enforce: 'pre',
    use:['pre1-loader', 'pre2-loader']
  },
  {
    test: /\.js/,
    enforce: 'post',
    use:['post1-loader', 'post2-loader']
  },
]


// let parts = request.split('!');
let parts = request.replace(/^-?!+/, '').split('!');
let resource = parts.pop();
// 行内loader
let inlineLoaders = [...parts];
let preLoaders = [], postLoaders = [], normalLoaders = [];

for (let i = 0; i < rules.length; i++) {
  const rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

let loaders = [];
if (request.startsWith('-!')) {
  // -! noPreAutoLoaders 不要前置和普通
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) {
  // !  不要普通
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
}  else if (request.startsWith('!')) {
  // !!  不要后置普通
  loaders = [...inlineLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
// 路径拼接
let resolveLoader = loader => path.resolve(__dirname, 'loaders', loader);
loaders = loaders.map(resolveLoader);

runLoaders({
  resource, // 要转换的资源
  loaders,
  context: {
    name: 'zhang'
  }, // this 指针
  readResource: fs.readFile.bind(this), // 获取资源的方法
}, (err, res) => {
  console.log(res.result[0]);
  console.log(res.resourceBuffer && res.resourceBuffer.toString());
})