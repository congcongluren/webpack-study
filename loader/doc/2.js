const path = require('path')

function stringifyRequest(loaderContext, request) {
  const splitted = request.split("!");
  const { context } = loaderContext;
  return JSON.stringify(
    splitted
      .map((part) => {
        let singlePath = part;
        singlePath = path.relative(context, singlePath);
        singlePath = `./${singlePath}`;
        return singlePath.replace(/\\/g, "/");
      })
      .join("!")
  );
}

const remainingRequest =  "D:\\zzg-stydu\\webpack-study\\loader\\loader\\less-loader.js!D:\\zzg-stydu\\webpack-study\\loader\\src\\index.less";

let res = stringifyRequest({context: process.cwd()}, remainingRequest)

console.log(res);
