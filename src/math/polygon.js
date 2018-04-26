import Delaunator from 'delaunator'
import { distance, ccw, pt, sum, sub, dot, scalar, degToRad, orthoginal } from './point'
import { segmentIntersectsSegment } from './line'
import { Rectangle } from './rectangle'

class Polygon {
  constructor (...points) {
    this.verticies = points
    this.size = this.verticies.length
    this._AABB = null
    this._AABB_DIRTY = true
  }

  translate (x, y) {
    this._AABB_DIRTY = true
    for (let vertex of this.verticies) {
      vertex.x += x
      vertex.y += y
    }
  }

  rotate (pt, rad) {
    this._AABB_DIRTY = true
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
    let minX = Infinity
    let minY = Infinity
    for (let i = this.verticies.length - 1; i >= 0; i--) {
      minX = Math.min(this.verticies[i].x, minX)
      minY = Math.min(this.verticies[i].y, minY)
    }
    return pt(minX, minY)
  }

  // Returns both the minimum and maximum elements of a polygon
  maxPoints () {
    let maxX = -Infinity
    let maxY = -Infinity
    for (let i = this.verticies.length - 1; i >= 0; i--) {
      maxX = Math.max(this.verticies[i].x, maxX)
      maxY = Math.max(this.verticies[i].y, maxY)
    }
    return pt(maxX, maxY)
  }

  AABB () {
    if (!this._AABB_DIRTY && this._AABB) {
      return this._AABB
    }
    let min = this.minPoints()
    let max = this.maxPoints()
    this._AABB = new Rectangle(min.x, min.y, max.x - min.x, max.y - min.y)
    return this._AABB
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
    let sumValue = pt(0, 0)
    for (let vertex of this.verticies) {
      sumValue = sum(vertex, sumValue)
    }
    sumValue.x /= this.verticies.length
    sumValue.y /= this.verticies.length
    return sumValue
  }

  centerOfMass () {
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
      /* eslint-disable indent */
      // Have to set this to a dummy variable due to bad babel translations/syntax?
      let int = (
        (p0.y <= pt.y && pt.y < p1.y) ||
        (p1.y <= pt.y && pt.y < p0.y)
      ) && (
        (pt.x < (p1.x - p0.x) * (pt.y - p0.y) /
        (p1.y - p0.y) + p0.x)
      ) && (c = !c)
      /* eslint-enable no-unused-vars */
      /* eslint-enable indent */
    }
    return c
  }

  intersectsSegment (seg) {
    for (let i = 0, j = 1, size = this.size; i < size; i++, j = (i + 1) % size) {
      const p0 = this.verticies[i]
      const p1 = this.verticies[j]
      const p2 = seg.p0
      const p3 = seg.p1
      const intersectsPt = segmentIntersectsSegment(p0, p1, p2, p3)
      if (intersectsPt) {
        return intersectsPt
      }
    }
    return this.intersectsPt(seg.p0)
  }

  // Fix later using SAT
  _seperatingAxis (projectionAxis, poly0, poly1) {
    let min1 = Infinity
    let min2 = Infinity
    let max1 = -Infinity
    let max2 = -Infinity

    for (let vertex of poly0) {
      const projection = dot(vertex, projectionAxis)
      min1 = Math.min(min1, projection)
      max1 = Math.max(max1, projection)
    }

    for (let vertex of poly1) {
      const projection = dot(vertex, projectionAxis)
      min2 = Math.min(min2, projection)
      max2 = Math.max(max2, projection)
    }

    if (max1 >= min2 && max2 >= min1) {
      // const d = Math.min(max2 - min1, max1 - min2)
      // const pv = d/dot(projectionAxis, projectionAxis) + 1e-10)
      /*
        d_over_o_squared = d/np.dot(o, o) + 1e-10
        pv = d_over_o_squared*o
        return False, pv
      */
      return false
    } else {
      return true
    }
  }

  intersectsConvexPoly (poly) {
    // get edges
    for (let i = 0, j = 1; i < this.size; i++, j = (i + 1) % this.size) {
      const p0 = this.verticies[i]
      const p1 = this.verticies[j]
      const edge = sub(p1, p0)
      const orth = orthoginal(edge)
      const sep = this._seperatingAxis(orth, this.verticies, poly.verticies)
      if (sep) {
        return false
      }
    }

    for (let i = 0, j = 1; i < poly.size; i++, j = (i + 1) % poly.size) {
      const p0 = poly.verticies[i]
      const p1 = poly.verticies[j]
      const edge = sub(p1, p0)
      const orth = orthoginal(edge)
      const sep = this._seperatingAxis(orth, this.verticies, poly.verticies)
      if (sep) {
        return false
      }
    }
    return true
  }

  intersectsConcavePoly (poly) {
    for (let i = 0, j = 1, size = this.size; i < size; i++, j = (i + 1) % size) {
      const p0 = this.verticies[i]
      const p1 = this.verticies[j]
      for (let x = 0, y = 1, psize = poly.size; x < psize; x++, y = (x + 1) % psize) {
        const p2 = poly.verticies[x]
        const p3 = poly.verticies[y]
        const intersectsPt = segmentIntersectsSegment(p0, p1, p2, p3)
        if (intersectsPt) {
          return intersectsPt
        }
      }
    }

    return poly.intersectsPt(this.verticies[0])
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

  isEqual (polygon) {
    if (polygon.size !== this.size) {
      return false
    }
    for (let i = 0; i < this.size; i++) {
      if (
        this.verticies[i].x !== polygon.verticies[i].x ||
        this.verticies[i].y !== polygon.verticies[i].y
      ) {
        return false
      }
    }
    return true
  }
  toConvexPolys () {
    const polygons = []
    const DMesh = Delaunator.from(this.verticies, p => p.x, p => p.y)
    const triangles = DMesh.triangles
    const points = this.verticies
    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = points[triangles[i]]
      const p2 = points[triangles[i + 1]]
      const p3 = points[triangles[i + 2]]
      const poly = new Polygon(p1, p2, p3)
      if (this.intersectsPt(poly.center())) {
        polygons.push(poly)
      }
    }
    return polygons
  }
}

export { Polygon }
