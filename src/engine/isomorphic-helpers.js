class DOMMock {
  addEventListener () {}
}

class WindowMock extends DOMMock {
  requestAnimationFrame () {}
}

class ContextMock extends DOMMock {
  lineTo () {}
  closePath () {}
  fill () {}
  stroke () {}
  fillRect () {}
  beginPath () {}
  moveTo () {}
  clearRect () {}
}

class CanvasMock extends DOMMock {
  getContext (type) {
    if (type === '2d') {
      return new ContextMock()
    }
  }
}

class DocumentMock extends DOMMock {
  getElementById (id) {
    if (id === 'canvas') {
      return new CanvasMock()
    }
  }
}

const isNode = _ => typeof window === 'undefined'

export { isNode, DOMMock, DocumentMock, WindowMock }
