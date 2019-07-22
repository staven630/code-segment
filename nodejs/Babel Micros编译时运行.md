
&emsp;&emsp;Babel Macros的关键特性是它们在编译时运行。通过babel-plugin-macros编写JavaScript，这样就可以在编译时运行代码。

.babelrc
```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "macros"
  ]
}
```
* [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)
```bash
npm i -D babel-plugin-macros preval.macro
```  

```javascript
import preval from 'preval.macro'

const twoPlusTwo = preval`module.exports = 2 + 2`
```

```javascript
import importAll from 'import-all.macro'
import path from 'path'
const result = importAll.sync('./files/*.js')


const arr = Object.entries(result).map(([filename, file]) => {
  const key = path.basename(filename, path.extname(filename));
  return [key, file.default]
})

const maps = new Map(arr)

console.log(maps)
```