- Map 转 Object

```
export const mapToObj = map => {
  const obj = Object.create(null)
  for (let [k, v] of map) {
    obj[k] = v
  }
  return obj
}
```

- Object 转 Map

```
export const objToMap = obj => {
  const map = new Map()
  for (let k of Object.keys(obj)) {
    map.set(k, obj[k])
  }
  return map
}
```
