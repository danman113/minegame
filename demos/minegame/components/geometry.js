import { pt, Polygon } from 'math'
import { drawPolygon } from 'engine/renderer'

const drawTexturedPolygon = (c, camera, poly, texture, e) => {
  // c.fillStyle = color
  let images = e.state.imageLoader.images
  c.strokeStyle = 'white'
  c.save()
  c.beginPath()
  c.moveTo(poly.verticies[0].x, poly.verticies[0].y)
  // c.fillRect(poly.verticies[0].x - 1, poly.verticies[0].y - 1, 3, 3)
  for (let i = 1; i < poly.verticies.length; i++) {
    let vertex = poly.verticies[i]
    c.lineTo(vertex.x, vertex.y)
    // c.fillRect(vertex.x - 1, vertex.y - 1, 3, 3)
  }
  c.lineTo(poly.verticies[0].x, poly.verticies[0].y)
  c.closePath()
  c.clip()
  let box = poly.AABB()
  c.fillStyle = 'rgba(255, 255, 255, 0.00)'
  c.drawImage(images[texture], box.x, box.y, box.width, box.height)

  c.fill()
  if (global.debug) {
    c.stroke()
  }
  c.restore()
}

export default class Geometry {
  constructor ({
    polygon = new Polygon(pt(0, 0), pt(0, 1), pt(1, 1)),
    visible = true,
    rotation = 0,
    texture = 'wall',
  }) {
    this.position = polygon.verticies[0]
    this.polygon = polygon
    this.rotation = rotation
    this.visible = visible
    console.log(texture)
    this.texture = texture
  }

  render (c, camera, e) {
    if (!this.visible) return
    this.polygon.translate(camera.position.x, camera.position.y)

    if (this.texture) {
      drawTexturedPolygon(c, camera, this.polygon, this.texture, e)
    } else {
      drawPolygon(c, this.polygon)
    }

    this.polygon.translate(-camera.position.x, -camera.position.y)
  }
}
