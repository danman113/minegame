const pt = (x, y) => ({x: x, y:y})

const distance = (pt1, pt2) => {
    Math.sqrt(
        (pt2.x - pt1.x) * (pt2.x - pt1.x) +
        (pt2.y - pt1.y) * (pt2.y - pt1.y)
    )
}

export { distance }
export default pt
