const pt = (x, y) => ({x: x, y:y})

const distance = (pt1, pt2) => Math.sqrt(
    (pt2.x - pt1.x) * (pt2.x - pt1.x) +
    (pt2.y - pt1.y) * (pt2.y - pt1.y)
)

const ccw = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

export { distance, pt, ccw }
