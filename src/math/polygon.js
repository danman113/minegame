import { distance, ccw, pt } from './point'

class Polygon {
  constructor (...points) {
    this.verticies = [...points]
    this.size = this.verticies.length
    this.isConvex = this.convex()
  }

  translate (x, y) {
    for (let vertex of this.verticies) {
      vertex.x += x
      vertex.y += y
    }
  }

  perimeter () {
    let p = 0
    for (let i = 0; i < this.verticies.length; i++) {
      let j = (i + 1) % this.size
      let p1 = this.verticies[i]
      let p2 = this.verticies[j]
      p += distance(p1, p2)
    }
    return p
  }

  center () {
    let center = pt(this.verticies[0].x, this.verticies[0].y)
    for (let i = 1; i < this.verticies.length; i++) {
      let p0 = this.verticies[i]
      center.x += p0.x
      center.y += p0.y
    }
    return center
  }

  area () {
    // area += poly[i].x * (poly[prev(i, n)].y - poly[next(i, n)].y);
    let a = 0
    for (let i = 0; i < this.verticies.length; i++) {
      let j = (i + 1) % this.size
      let k = (i - 1 + this.size) % this.size
      let p0 = this.verticies[k]
      let p1 = this.verticies[i]
      let p2 = this.verticies[j]
      a += p1.x * (p0.y - p2.y)
    }
    return a / 2
  }

  convex () {
    let isLeft = ccw(this.verticies[0], this.verticies[1], this.verticies[2])
    for (let i = 0; i < this.size - 1; i++) {
      let j = (i + 1) % this.size
      let k = (i + 2) % this.size
      let p0 = this.verticies[i]
      let p1 = this.verticies[j]
      let p2 = this.verticies[k]
      if (ccw(p0, p1, p2) !== isLeft) {
        return false
      }
    }
    return true
  }

  intersectsPt (pt) {
    let c = false
    for (var i = -1, l = this.verticies.length, j = l - 1; ++i < l; j = i) {
      let p0 = this.verticies[i]
      let p1 = this.verticies[j]
      /* eslint-disable no-unused-vars */
      let int = (
        (p0.y <= pt.y && pt.y < p1.y) ||
        (p1.y <= pt.y && pt.y < p0.y)
      ) && (
        (pt.x < (p1.x - p0.x) * (pt.y - p0.y) /
        (p1.y - p0.y) + p0.x)
      ) && (c = !c)
      /* eslint-enable no-unused-vars */
    }
    return c
  }

  // Fix later
  intersectsPoly (poly) {
    for (let i = 0; i < this.size; i++) {
      let p0 = this.verticies[i]
      if (poly.intersectsPt(p0)) { return true }
    }
  }
}

export { Polygon }
