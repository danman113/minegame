import { distance, ccw, pt, sum, scalar, degToRad } from './point'
import { segmentIntersectsSegment } from './line'
import { Rectangle } from './rectangle'

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

  rotate (pt, rad) {
    for (let vertex of this.verticies) {
      const x = vertex.x - pt.x
      const y = vertex.y - pt.y
      const rotx = Math.cos(rad)
      const roty = Math.sin(rad)
      const dx = x * rotx - y * roty
      const dy = x * roty + y * rotx
      vertex.x = pt.x + dx
      vertex.y = pt.y + dy
    }
  }

  rotateDeg (pt, deg) {
    this.rotate(pt, degToRad(deg))
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

  // Returns both the min x and y value of polygon
  minPoints () {
    let x = this.verticies.reduce((a, b) => pt(Math.min(a.x, b.x), 0), pt(Infinity, Infinity))
    let y = this.verticies.reduce((a, b) => pt(0, Math.min(a.y, b.y)), pt(Infinity, Infinity))
    return pt(x.x, y.y)
  }

  // Returns both the minimum and maximum elements of a polygon
  maxPoints () {
    let x = this.verticies.reduce((a, b) => pt(Math.max(a.x, b.x), 0), pt(-Infinity, -Infinity))
    let y = this.verticies.reduce((a, b) => pt(0, Math.max(a.y, b.y)), pt(-Infinity, -Infinity))
    return pt(x.x, y.y)
  }

  AABB () {
    let min = this.minPoints()
    let max = this.maxPoints()
    return new Rectangle(min.x, min.y, max.x - min.x, max.y - min.y)
  }

  // Returns the verticies of polygon as if it were located at (0, 0)
  fromZero () {
    let min = (scalar(this.minPoints(), -1))
    let verticies = []
    this.verticies.forEach(v => {
      verticies.push(sum(v, min))
    })
    return verticies
  }

  center () {
    // X = SUM[(Xi + Xi+1) * (Xi * Yi+1 - Xi+1 * Yi)] / 6 / A
    // Y = SUM[(Yi + Yi+1) * (Xi * Yi+1 - Xi+1 * Yi)] / 6 / A
    let center = pt(0, 0)
    const area = Math.abs(this.area())
    const min = this.minPoints()
    // Need to normalize from 0
    const zerod = this.fromZero()
    for (let i = 0; i < zerod.length - 1; i++) {
      let p0 = zerod[i]
      let p1 = zerod[i + 1]
      const normalizingConstant = (p0.x * p1.y - p1.x * p0.y)
      center.x += (p0.x + p1.x) * normalizingConstant
      center.y += (p0.y + p1.y) * normalizingConstant
    }
    center.x = (center.x / (6 * area)) + min.x
    center.y = (center.y / (6 * area)) + min.y
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
      // Have to set this to a dummy variable due to bad babel translations/syntax?
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

  // Fix later using SAT
  intersectsConvexPoly (poly) {
    return pt(0, 0)
  }

  intersectsConcavePoly (poly) {
    for (let i = 0, j = 1, size = this.size; i < size; i++, j = (i + 1) % size) {
      let p0 = this.verticies[i]
      let p1 = this.verticies[j]
      for (let x = 0, y = 1, psize = poly.size; x < psize; x++, y = (x + 1) % psize) {
        let p2 = poly.verticies[x]
        let p3 = poly.verticies[y]
        if (segmentIntersectsSegment(p0, p1, p2, p3)) {
          return true
        }
      }
    }
    return false
  }

  // Generates a convex hull of the polygon. Not optimized for speed
  generateConvexHull () {
    let hull = []
    // Find min x value in poly
    let xmin = this.verticies.reduce(
      (a, b) => {
        if (Math.min(a.x, b.x) === a.x) {
          return a
        } else {
          return b
        }
      }, pt(Infinity, Infinity)
    )
    // let y = this.verticies.reduce((a, b) => pt(0, Math.min(a.y, b.y)), pt(Infinity, Infinity))

    // find max x value in poly
    let xmax = this.verticies.reduce(
      (a, b) => {
        if (Math.max(a.x, b.x) === a.x) {
          return a
        } else {
          return b
        }
      }, pt(-Infinity, -Infinity)
    )

    this._findHull(hull, xmin, xmax, 1)
    this._findHull(hull, xmin, xmax, -1)

    // Need to sort points w/ respect to original poly
    let sortedHull = []
    for (let i = 0; i < this.verticies.length; i++) {
      const v = this.verticies[i]
      for (let j = 0; j < hull.length; j++) {
        const h = hull[j]
        if (h.x === v.x && h.y === v.y) {
          sortedHull.push(h)
          break
        }
      }
    }
    return new Polygon(...sortedHull)
  }

  _findSide (p1, p2, p) {
    const dist = (p.y - p1.y) * (p2.x - p1.x) -
      (p2.y - p1.y) * (p.x - p1.x)

    if (dist > 0) { return 1 }
    if (dist < 0) { return -1 }
    return 0
  }

  _lineDist (p1, p2, p) {
    return Math.abs((p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x))
  }
  _findHull (hull, xmin, xmax, side) {
    // Find the furthest point from the line from xmin -> xmax
    let largestDist = 0
    let largestIndex = -1
    for (let i = 0; i < this.verticies.length; i++) {
      const v = this.verticies[i]
      const dist = this._lineDist(xmin, xmax, v)
      if (dist > largestDist && this._findSide(xmin, xmax, v) === side) {
        largestDist = dist
        largestIndex = i
      }
    }

    if (largestIndex === -1) {
      hull.push(xmin, xmax)
      return
    }

    const c = this.verticies[largestIndex]
    this._findHull(hull, c, xmin, -this._findSide(c, xmin, xmax))
    this._findHull(hull, c, xmax, -this._findSide(c, xmax, xmin))
  }
}

export { Polygon }
