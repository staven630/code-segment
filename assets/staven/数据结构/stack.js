class Stack {
  constructor() {
    this.count = 0
    this.items = {}
  }

  // 添加元素
  push(element) {
    this.items[this.count] = element
    this.count++
  }

  // 移除元素
  pop() {
    if (this.isEmpty()) return undefined
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }

  // 查看栈顶元素
  peek() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.count - 1]
  }

  // 检查栈是否为空
  isEmpty() {
    return this.count === 0
  }

  // 查看栈长度
  size() {
    return this.count
  }

  // 清空栈
  clear() {
    this.items = {}
    this.count = 0
  }

  toString() {
    if (this.isEmpty()) return ''
    let str = `${this.items[0]}`
    for (let i = 1; i < this.count; i++) {
      str = `${str}, ${this.items[i]}`
    }
    return str
  }
}

const stack = new Stack()

console.log(Object.getOwnPropertyNames(stack))
console.log(Object.keys(stack))
