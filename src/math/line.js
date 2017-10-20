import { pt } from './point'

const slope = (p0, p1) => (p0.y - p1.y) / (p0.x - p1.x)

class Line {
  // Takes two points as a line segment.
  constructor (p0, p1) {
    this.p0 = p0
    this.p1 = p1
  }

  intersectsLine (line) {
    let A0 = this.p1.y - this.p0.y
    let B0 = this.p0.x - this.p1.x
    let C0 = A0 * this.p0.x + B0 * this.p0.y

    let A1 = line.p1.y - line.p0.y
    let B1 = line.p0.x - line.p1.x
    let C1 = A1 * line.p0.x + B1 * line.p0.y
    let denom = A0 * B1 - A1 * B0
    return pt(
      (B1 * C0 - B0 * C1) / denom,
      (A0 * C1 - A1 * C0) / denom
    )
  }

  intersectsSegment (seg) {
    let A0 = this.p1.y - this.p0.y
    let B0 = this.p0.x - this.p1.x
    let C0 = A0 * this.p0.x + B0 * this.p0.y

    let A1 = seg.p1.y - seg.p0.y
    let B1 = seg.p0.x - seg.p1.x
    let C1 = A1 * seg.p0.x + B1 * seg.p0.y
    let denom = A0 * B1 - A1 * B0
    if (denom === 0) { return null }
    let intersectX = (B1 * C0 - B0 * C1) / denom
    let intersectY = (A0 * C1 - A1 * C0) / denom
    // let r0x = (intersectX - this.p0.x) / (this.p1.x - this.p0.x)
    // let r0y = (intersectY - this.p0.y) / (this.p1.y - this.p0.y)
    let r1x = (intersectX - seg.p0.x) / (seg.p1.x - seg.p0.x)
    let r1y = (intersectY - seg.p0.y) / (seg.p1.y - seg.p0.y)
    if ((r1x >= 0 && r1x <= 1) || (r1y >= 0 && r1y <= 1)) { return pt(intersectX, intersectY) }
    return null
  }

  //
  rotate (deg) {
    const x = this.p1.x - this.p0.x
    const y = this.p1.y - this.p0.y
    const rotx = Math.cos(deg)
    const roty = Math.sin(deg)
    const dx = x * rotx - y * roty
    const dy = x * roty + y * rotx
    this.p1.x = this.p0.x + dx
    this.p1.y = this.p0.y + dy
  }
}

class Segment extends Line {
  intersectsLine (ln) {
    let A0 = this.p1.y - this.p0.y
    let B0 = this.p0.x - this.p1.x
    let C0 = A0 * this.p0.x + B0 * this.p0.y

    let A1 = ln.p1.y - ln.p0.y
    let B1 = ln.p0.x - ln.p1.x
    let C1 = A1 * ln.p0.x + B1 * ln.p0.y
    let denom = A0 * B1 - A1 * B0
    if (denom === 0) { return null }
    let intersectX = (B1 * C0 - B0 * C1) / denom
    let intersectY = (A0 * C1 - A1 * C0) / denom
    let r0x = (intersectX - this.p0.x) / (this.p1.x - this.p0.x)
    let r0y = (intersectY - this.p0.y) / (this.p1.y - this.p0.y)
    // let r1x = (intersectX - ln.p0.x) / (ln.p1.x - ln.p0.x)
    // let r1y = (intersectY - ln.p0.y) / (ln.p1.y - ln.p0.y)
    if ((r0x >= 0 && r0x <= 1) || (r0y >= 0 && r0y <= 1)) { return pt(intersectX, intersectY) }
    return null
  }
}

class Ray extends Line {
  intersectsSegment (seg) {
    let A0 = this.p1.y - this.p0.y
    let B0 = this.p0.x - this.p1.x
    let C0 = A0 * this.p0.x + B0 * this.p0.y

    let A1 = seg.p1.y - seg.p0.y
    let B1 = seg.p0.x - seg.p1.x
    let C1 = A1 * seg.p0.x + B1 * seg.p0.y
    let denom = A0 * B1 - A1 * B0
    if (denom === 0) { return null }
    let intersectX = (B1 * C0 - B0 * C1) / denom
    let intersectY = (A0 * C1 - A1 * C0) / denom
    let dist1X = Math.abs(intersectX - this.p1.x)
    let dist1Y = Math.abs(intersectY - this.p1.y)
    let dist0X = Math.abs(intersectX - this.p0.x)
    let dist0Y = Math.abs(intersectY - this.p0.y)
    // console.log(dist1X, dist1Y)
    // console.log(dist0X, dist0Y)
    if (dist1X > dist0X || dist1Y > dist0Y) { return null }
    // let r0x = (intersectX - this.p0.x) / (this.p1.x - this.p0.x)
    // let r0y = (intersectY - this.p0.y) / (this.p1.y - this.p0.y)
    let r1x = (intersectX - seg.p0.x) / (seg.p1.x - seg.p0.x)
    let r1y = (intersectY - seg.p0.y) / (seg.p1.y - seg.p0.y)
    if ((r1x >= 0 && r1x <= 1) || (r1y >= 0 && r1y <= 1)) { return pt(intersectX, intersectY) }
    return null
  }
}

export { Line, Segment, Ray, slope }
