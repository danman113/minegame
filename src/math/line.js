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
}

class Segment extends Line {

}

class Ray extends Line {

}

export { Line, Segment, Ray, slope }
