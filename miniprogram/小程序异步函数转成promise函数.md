```
const promisify = original => {
  return (...opt) => {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(...opt)
    })
  }
}
```
调用函数
```
promisify(wx.getStorage)({key: 'key'})
.then(value => {
}).catch(reason => {
});
```