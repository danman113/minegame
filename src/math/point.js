const pt = (x, y) => ({x: x, y: y})

// Eucliean distance between two points
const distance = (pt1, pt2) => Math.sqrt(
    (pt2.x - pt1.x) * (pt2.x - pt1.x) +
    (pt2.y - pt1.y) * (pt2.y - pt1.y)
)

// Given the three points, are the counter clockwise?
const ccw = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)

// Angle between two points in radians
const angle2 = (a, b) => Math.atan2(b.y - a.y, b.x - a.x)

// Angle between three points in radians
const angle3 = (a, b, c) => Math.atan2(a.y - b.y, a.x - b.x) - Math.atan2(c.y - b.y, c.x - b.x)

const sum = (a, b) => pt(a.x + b.x, a.y + b.y)

const scalar = (a, c) => pt(a.x * c, a.y * c)

export { distance, pt, ccw, angle2, angle3, sum, scalar }
