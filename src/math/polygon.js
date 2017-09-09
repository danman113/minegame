import { distance, ccw } from './point'

class Polygon {
	constructor(...pts) {
  	this.verticies = [...pts]
  	this.size = this.verticies.length
  	this.isConvex = this.convex()
  }

  translate(x,y) {
  	for(let vertex of this.verticies) {
      vertex.x += x
      vertex.y += y
    }
  }
  
  perimeter() {
    let p = 0;
    for(let i = 0; i < this.verticies.length; i++) {
      let j = (i + 1) % this.size
      let p1 = this.verticies[i]
      let p2 = this.verticies[j]
      p += distance(p1, p2)
    }
    return p
  }
  
  area() {
    // area += poly[i].x * (poly[prev(i, n)].y - poly[next(i, n)].y);
    let a = 0;
    for(let i = 0; i < this.verticies.length; i++) {
      let j = (i + 1) % this.size
      let k = (i - 1 + this.size) % this.size
      let p0 = this.verticies[k]
      let p1 = this.verticies[i]
      let p2 = this.verticies[j]
      a += p1.x * (p0.y - p2.y)
    }
    return a/2
  }

  convex() {
    let isLeft = ccw(this.verticies[0], this.verticies[1], this.verticies[2])
    for(let i = 0; i < this.size - 1; i++) {
      let j = (i + 1) % this.size
      let k = (i + 2) % this.size
      let p0 = this.verticies[i]
      let p1 = this.verticies[j]
      let p2 = this.verticies[k]
      if (ccw(p0, p1, p2) != isLeft) {
        return false
      }
    }
    return true
  }
}

export { Polygon }