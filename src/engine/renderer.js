const drawPolygon = (c, poly, color = '#f00') => {
  c.fillStyle = color
  c.strokeStyle = 'white'
	c.beginPath();
  let str = ""
  c.moveTo(poly.verticies[0].x, poly.verticies[0].y);
  c.fillRect(poly.verticies[0].x - 1, poly.verticies[0].y - 1, 3, 3)
  for(let i = 1; i < poly.verticies.length; i++) {
  	let vertex = poly.verticies[i]
    str += `(${vertex.x}, ${vertex.y}) -> `
  	c.lineTo(vertex.x, vertex.y);
    c.fillRect(vertex.x - 1, vertex.y - 1, 3, 3)
  }
  c.lineTo(poly.verticies[0].x, poly.verticies[0].y);
  c.closePath();
  c.fill();
  c.stroke();
}

export { drawPolygon }
