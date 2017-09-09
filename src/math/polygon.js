class Polygon {
	constructor(...pts) {
  	this.verticies = [...pts]
  }

  translate(x,y) {
  	for(let vertex of this.verticies) {
      vertex.x += x
      vertex.y += y
    }
  }
}

export default Polygon
