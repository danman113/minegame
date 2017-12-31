import { pt } from './point'
import { Polygon } from './polygon'

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
    const rect1x = this.x
    const rect1y = this.y
    const rect1w = this.width
    const rect1h = this.height
    const rect2x = pt.x
    const rect2y = pt.y
    const rect2w = 1
    const rect2h = 1
    return (
      rect1x + rect1w > rect2x &&
      rect1x < (rect2x + rect2w) &&
      rect1y + rect1h > rect2y &&
      rect1y < (rect2y + rect2h)
    )
  }

  center () {
    return pt(this.x + this.width / 2, this.y + this.height / 2)
  }
}

// OOP so why not
class Square extends Rectangle {
  constructor (x, y, side) {
    super(x, y, side, side)
  }
}

const rectToPolygon = (x, y, width, height) => {
  const topLeft = pt(x, y)
  const topRight = pt(x + width, y)
  const bottomRight = pt(x + width, y + height)
  const bottomLeft = pt(x, y + height)
  return new Polygon(topLeft, topRight, bottomRight, bottomLeft)
}

export { Rectangle, Square, rectToPolygon }
