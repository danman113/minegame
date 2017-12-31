const pt = (x, y) => ({x: x, y: y})

const ZERO = pt(0, 0)

// Eucliean distance between two points
const distance = (pt1, pt2) => Math.sqrt(
  (pt2.x - pt1.x) * (pt2.x - pt1.x) +
  (pt2.y - pt1.y) * (pt2.y - pt1.y)
)

// Magnitude 
const magnitude = v => distance(v, ZERO)

// Given the three points, are the counter clockwise?
const ccw = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)

// Angle between two points in radians
const angle2 = (a, b) => Math.atan2(b.y - a.y, b.x - a.x)

// Angle between three points in radians
const angle3 = (a, b, c) => Math.atan2(a.y - b.y, a.x - b.x) - Math.atan2(c.y - b.y, c.x - b.x)

const piNum = Math.PI / 180
const numPi = 180 / Math.PI
const degToRad = deg => deg * piNum
const radToDeg = rad => rad * numPi

const sum = (a, b) => pt(a.x + b.x, a.y + b.y)
const sub = (a, b) => pt(a.x - b.x, a.y - b.y)

const dot = (a, b) => a.x * b.x + a.y * b.y
const unit = a => {
  const dist = distance(pt(0, 0), a)
  return pt(a.x / dist, a.y / dist)
}

const normal = (p0, p1) => {
  // if we define dx=x2-x1 and dy=y2-y1, then the normals are (-dy, dx) and (dy, -dx).
  let dx = p1.x - p0.x
  let dy = p1.y - p0.y
  // orthoginal(sub(p1, p0))
  return pt(-dy, dx)
}

const orthoginal = v => pt(-v.y, v.x)

const scalar = (a, c) => pt(a.x * c, a.y * c)

export {
  pt,
  ccw,
  sum,
  sub,
  dot,
  ZERO,
  unit,
  scalar,
  normal,
  angle2,
  angle3,
  degToRad,
  radToDeg,
  distance,
  magnitude,
  orthoginal
}
