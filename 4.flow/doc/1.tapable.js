// const { SyncHook } = require('tapable');

class SyncHook{
  constructor(){
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push({
      name, fn
    })
  }
  call(...args) {
    this.taps.forEach(tap => tap.fn(...args))
  }
}
let syncHook = new SyncHook(['name']);

syncHook.tap('jinting1', (name) => {
  console.log('jinting1', name);
})

syncHook.tap('jinting2', (name) => {
  console.log('jinting1', name);
})

syncHook.call('name');



class SomePlugin {
  apply() {
    syncHook.tap('SomePlugin', (name) => {
      console.log('SomePlugin', name);
    })
  }
}

new SomePlugin().apply();
syncHook.call('名称')