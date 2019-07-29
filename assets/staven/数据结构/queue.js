class Queue {
  constructor() {
    this.count = 0
    this.lowestCount = 0
    this.items = {}
  }

  enqueue(element) {
    this.items[this.count] = element
    this.count++
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }

  peek() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount]
  }

  isEmpty() {
    return this.size() === 0
  }

  size() {
    return this.count - this.lowestCount
  }

  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
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
}

function hotPotato(list, num) {
  const queue = new Queue()
  const lowers = []
  for (let i = 0; i < list.length; i++) {
    queue.enqueue(list[i])
  }
  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue())
    }
    lowers.push(queue.dequeue())
  }
  return {
    lowers: lowers,
    winner: queue.dequeue()
  }
}

a = hotPotato(['s', 't', 'a', 'v', 'e', 'n'], 10)
console.log(a)
