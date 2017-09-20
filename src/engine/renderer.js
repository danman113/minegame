const drawPolygon = (c, poly, color = '#f00', bg = '#00a') => {
  c.fillStyle = bg
  const box = poly.AABB()
  c.fillRect(box.x, box.y, box.width, box.height)
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

export { drawPolygon }
