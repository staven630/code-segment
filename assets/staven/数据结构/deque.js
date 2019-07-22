class Deque {
  constructor() {
    this.count = 0
    this.lowestCount = 0
    this.items = {}
  }

  addFront(element) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else if (this.lowestCount > 0) {
      this.lowestCount--
      this.items[this.lowestCount] = element
    } else {
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1]
      }
      this.count++
      this.lowestCount = 0
      this.items[0] = element
    }
  }

  addBack(element) {
    this.items[this.count] = element
    this.count++
  }

  removeFront() {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }

  removeBack() {
    if (this.isEmpty()) {
      return undefined
    }
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }

  peekFront() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount]
  }

  peekBack() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.count - 1]
  }

  size() {
    return this.count - this.lowestCount
  }

  isEmpty() {
    return this.size() === 0
  }

  toString() {
    if (this.isEmpty()) {
      return ''
    }
    let str = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      str = `${str},${this.items[i]}`
    }
    return str
  }

  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
  }
}

const deque = new Deque()
deque.addBack('10')
deque.addBack('11')
deque.addBack('12')
// 10, 11, 12

deque.addFront('13')
// 13 10 11 13
deque.removeBack()
console.log(deque.getItem())

console.log(deque.toString())
