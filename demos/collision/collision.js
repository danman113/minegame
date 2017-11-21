import { pt, Polygon, Rectangle } from '../../src/math'


class Collidable {
  constructor(polygon, AABB) {
    this.AABB = AABB
    this.polygon = polygon
    if (polygon) {
      this.recomputeAABB()
    }
    this.dirty = false
  }
  
  recomputeAABB() {
    this.AABB = this.polygon.AABB()
  }

  collides(collidable) {
    if(this.AABB.intersectsRect(collidable.AABB)) {
      if (!this.polygon || !collidable.polygon) {
        return true
      } else {
        // Lazy, seems to be more efficient than convex
        const intersectPt = this.polygon.intersectsConcavePoly(collidable.polygon)
        // console.log(intersectPt)
        return intersectPt
      }
    } else {
      return false
    }
  }
  
  translate(x = 0, y = 0, checks) {
    this.polygon.translate(x, y)
    this.AABB.x += x
    this.AABB.y += y
    for (let check of checks) {
      if (this.collides(check)) {
        this.polygon.translate(-x, -y)
        this.AABB.x += -x
        this.AABB.y += -y
        return false
      }
    }
    return true
  }
  
  rotate(deg = 0, checks) {
    this.polygon.rotateDeg(this.AABB.center(), deg)
    this.recomputeAABB()
    for (let check of checks) {
      if (this.collides(check)) {
        this.polygon.rotateDeg(this.AABB.center(), -deg)
        this.recomputeAABB()
        return
      }
    }
  }
}

export default Collidable
