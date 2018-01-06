import { pt, distance, sum, Polygon } from 'math'

export class Circle {
  constructor (pos = pt(0, 0), radius = 5) {
    this.position = pos
    this.radius = radius
  }

  intersectsCircle (circle) {
    let dist = distance(this.position, circle.position)
    if (dist < this.radius + circle.radius) {
      return true
    }
    return false
  }

  intersectsPt (pt) {
    let dist = distance(this.position, pt)
    if (dist < this.radius) {
      return true
    }
    return false
  }

  intersectsPoly (poly) {
    if (poly.intersectsPt(this.position)) {
      return true
    }
    for (let i = 0, j = 1; i < poly.verticies.length; i++, j = ((j + 1) % (poly.verticies.length))) {
      const p0 = poly.verticies[i]
      const p1 = poly.verticies[j]
      if (this.pDistance(this.position.x, this.position.y, p0.x, p0.y, p1.x, p1.y) < this.radius) {
        return true
      }
    }
    return false
  }

  toPolygon () {
    return new Polygon(
      pt(this.position.x - this.radius, this.position.y),
      pt(this.position.x, this.position.y + this.radius),
      pt(this.position.x + this.radius, this.position.y),
      pt(this.position.x, this.position.y - this.radius)
    )
  }

  mergeCircles (circle) {
    return new Polygon(
      pt(this.position.x, this.position.y + this.radius),
      pt(circle.position.x, circle.position.y + circle.radius),
      pt(circle.position.x, circle.position.y - circle.radius),
      pt(this.position.x, this.position.y - this.radius)
    )
  }

  getEdgeFromPoly (poly) {
    for (let i = 0, j = 1; i < poly.verticies.length; i++, j = ((j + 1) % (poly.verticies.length))) {
      const p0 = poly.verticies[i]
      const p1 = poly.verticies[j]
      if (this.pDistance(this.position.x, this.position.y, p0.x, p0.y, p1.x, p1.y) < this.radius) {
        return [p0, p1]
      }
    }
    return null
  }

  pDistance (x, y, x1, y1, x2, y2) {
    const A = x - x1
    const B = y - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    if (lenSq !== 0) {
      param = dot / lenSq
    }
    var xx, yy

    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = x - xx
    const dy = y - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  translate (x, y) {
    this.position = sum(this.position, pt(x, y))
  }
}
