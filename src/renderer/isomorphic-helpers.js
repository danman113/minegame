class ContextMock {
  lineTo(){}
  closePath(){}
  fill(){}
  stroke(){}
  fillRect(){}
  beginPath(){}
  moveTo(){}
}

class CanvasMock {
  getContext(type) {
    if (type === '2d') {
      return new ContextMock()
    }
  }
}

class DocumentMock {
  getElementById(id) {
    if (id === 'canvas') {
      return new CanvasMock()
    }
  }
}

const isNode = _ => typeof window === 'undefined'

export { isNode, DocumentMock }