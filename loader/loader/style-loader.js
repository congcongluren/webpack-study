const path = require('path');

function loader(cssContent) {
  // let script = `
  //   let style = document.createElement('style');
  //   style.innerHTML = ${JSON.stringify(cssContent)}
  //   document.head.appendChild(style);
  // `
  console.log(JSON.stringify(cssContent), 'style');
  return JSON.stringify(cssContent);
}

loader.pitch = function (remainingRequest) {
  let script = `
    let style = document.createElement('style');
    style.innerHTML = require(${ stringifyRequest(this, "!!" +remainingRequest)});
    document.head.appendChild(style);
  `
  console.log(script, '11');

  return script;
}

module.exports = loader;


function stringifyRequest(loaderContext, request) {
  const splitted = request.replace(/^-?!+/, '').split("!");
  const { context } = loaderContext;
  return JSON.stringify(
    "!!" + splitted
      .map((part) => {
        let singlePath = part;
        singlePath = path.relative(context, singlePath);
        // singlePath = `./${singlePath}`;
        if (singlePath[0] !== '.') {
          singlePath = './' + singlePath;
        }
        return singlePath.replace(/\\/g, "/");
      })
      .join("!")
  );
}