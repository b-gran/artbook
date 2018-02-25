const Sentinel = Symbol('sentinel')

class LinkedList {
  constructor () {
    this.root = Sentinel
    this.length = 0
  }

  head () {
    return this.root === Sentinel
      ? undefined
      : this.root.data
  }

  append (data) {
    this.length += 1

    const node = new _Node(data)
    if (this.root === Sentinel) {
      this.root = node
      return this
    }
    appendNode(node, this.root)
    return this
  }

  pop () {
    if (this.root === Sentinel) {
      return undefined
    }

    this.length -= 1

    const head = this.root
    this.root = this.root.next
    return head.data
  }

  nth (n) {
    if (n >= this.length) {
      return undefined
    }

    const node = nthNode(n, this.root)
    return node === Sentinel
      ? undefined
      : node.data
  }
}
LinkedList.fromArray = array => array.reduce(
  (linkedList, element) => linkedList.append(element),
  new LinkedList()
)
LinkedList.range = R.curry((min, max) => {
  const list = new LinkedList()
  for (let i = min; i < max; i++) {
    list.append(i)
  }
  return list
})

class _Node {
  constructor (data, next = Sentinel) {
    this.data = data
    this.next = next
  }
}

// Append a node to a linked list (as a node)
const appendNode = R.curry((node, list) => {
  if (list === Sentinel) {
    return node
  }

  let current = list
  while (current.next !== Sentinel) {
    current = current.next
  }
  current.next = node

  return list
})

// Return the nth node of a linked list (as a node)
// Returns the sentinel if n is greater than the length of the list
const nthNode = R.curry((n, list) => {
  let curr = list
  for (let i = 0; i < n; i++) {
    if (curr === Sentinel) {
      break
    }
    curr = curr.next
  }
  return curr
})

