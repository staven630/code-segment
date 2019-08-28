/**
 * flat安装一个可指定的深度递归遍历数组，指定深度内的子数组元素规整到最外层数组中
 */

var arr1 = [1, 2, [3, 4]]
// 默认规整第一层
console.log(arr1.flat()); // [1, 2, 3, 4]
var arr2 = [1, 2, [3, 4, [5, 6]], 7];
console.log(arr2.flat())  // [ 1, 2, 3, 4, [ 5, 6 ], 7 ]

// 指定深度为2
console.log(arr2.flat(2)) // [ 1, 2, 3, 4, 5, 6, 7 ]

// Infinity表示规整任意层
console.log(arr2.flat(Infinity))  // [ 1, 2, 3, 4, 5, 6, 7 ]

// flat()会移除数组中的空项
var arr3 = [1, 2, , 4, 5]
console.log(arr3.flat())  // [ 1, 2, 4, 5 ]

// *****
// 替代方案
// *****

// 只对一层规整
// 方法1：
let flat = arr => [].concat(...arr)
console.log(flat(arr1))  // [ 1, 2, 3, 4 ]

// 方法2：
flat = arr => arr.reduce((acc, curr) => acc.concat(curr), [])
console.log(flat(arr1))  // [ 1, 2, 3, 4 ]

// 任意层规整
var arr4 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
let flatDeep = arr => {
  return arr.reduce((acc, curr) => {
    return acc.concat(Array.isArray(curr) ? flatDeep(curr) : curr)
  }, [])
}
console.log(flatDeep(arr4)) // [ 1, 2, 3, 1, 2, 3, 4, 2, 3, 4 ]

flatDeep = arr => {
  const list = [...arr]
  const ret = []
  while (list.length) {
    const last = list.pop()
    if (Array.isArray(last)) {
      list.push(...last)
    } else {
      ret.push(last)
    }
  }

  return ret.reverse()
}

console.log(flatDeep(arr4))