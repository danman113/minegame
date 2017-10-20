const drawPolygon = (c, poly, color = '#f00', bg = '#00a', showBox = false) => {
  if (showBox) {
    c.fillStyle = bg
    const box = poly.AABB()
    c.fillRect(box.x, box.y, box.width, box.height)
  }
  c.fillStyle = color
  c.strokeStyle = 'white'
  c.beginPath()
  c.moveTo(poly.verticies[0].x, poly.verticies[0].y)
  c.fillRect(poly.verticies[0].x - 1, poly.verticies[0].y - 1, 3, 3)
  for (let i = 1; i < poly.verticies.length; i++) {
    let vertex = poly.verticies[i]
    c.lineTo(vertex.x, vertex.y)
    c.fillRect(vertex.x - 1, vertex.y - 1, 3, 3)
  }
  c.lineTo(poly.verticies[0].x, poly.verticies[0].y)
  c.closePath()
  c.fill()
  c.stroke()
  const center = poly.center()
  c.fillStyle = 'black'
  c.fillRect(center.x - 1, center.y - 1, 3, 3)
}

const drawLine = (c, line, color = '#fff', bg = '#f00') => {
  // Before
  c.strokeStyle = bg
  c.beginPath()
  c.moveTo(line.p0.x, line.p0.y)
  c.lineTo(line.p0.x - (line.p1.x - line.p0.x) * 0xffff, line.p0.y - (line.p1.y - line.p0.y) * 0xffff)
  c.closePath()
  c.stroke()
  // Segment
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(line.p0.x, line.p0.y)
  c.lineTo(line.p1.x, line.p1.y)
  c.closePath()
  c.stroke()
  // After
  c.strokeStyle = bg
  c.beginPath()
  c.moveTo(line.p1.x, line.p1.y)
  c.lineTo(line.p1.x + (line.p1.x - line.p0.x) * 0xffff, line.p1.y + (line.p1.y - line.p0.y) * 0xffff)
  c.closePath()
  c.stroke()
}

const drawSegment = (c, seg, color = '#fff', fill = '#f00') => {
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(seg.p0.x, seg.p0.y)
  c.lineTo(seg.p1.x, seg.p1.y)
  c.closePath()
  c.stroke()
  c.fillStyle = fill
  c.fillRect(seg.p0.x - 1, seg.p0.y - 1, 3, 3)
  c.fillRect(seg.p1.x - 1, seg.p1.y - 1, 3, 3)
}

const drawRay = (c, seg, color = '#fff', fill = '#f00') => {
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(seg.p0.x, seg.p0.y)
  c.lineTo(seg.p1.x, seg.p1.y)
  c.closePath()
  c.stroke()
  c.fillStyle = fill
  c.fillRect(seg.p0.x - 1, seg.p0.y - 1, 3, 3)

  c.strokeStyle = fill
  c.beginPath()
  c.moveTo(seg.p1.x, seg.p1.y)
  c.lineTo(seg.p1.x + (seg.p1.x - seg.p0.x) * 0xffff, seg.p1.y + (seg.p1.y - seg.p0.y) * 0xffff)
  c.closePath()
  c.stroke()
}

export { drawPolygon, drawLine, drawSegment, drawRay }
