class Rectangle {
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  intersectsRect (box) {
    const rect1x = this.x
    const rect1y = this.y
    const rect1w = this.width
    const rect1h = this.height
    const rect2x = box.x
    const rect2y = box.y
    const rect2w = box.width
    const rect2h = box.height
    return (
      rect1x + rect1w > rect2x &&
      rect1x < (rect2x + rect2w) &&
      rect1y + rect1h > rect2y &&
      rect1y < (rect2y + rect2h)
    )
  }

  intersectsPt (pt) {
    return this.intersectsRect(pt.x, pt.y, 1, 1)
  }
}

// OOP so why not
class Square extends Rectangle {
  constructor (x, y, side) {
    super(x, y, side, side)
  }
}

export { Rectangle, Square }
