import { pt, Polygon } from 'math'
import { drawPolygon } from 'engine/renderer'

export default class Geometry {
  constructor ({
    polygon = new Polygon(pt(0, 0), pt(0, 1), pt(1, 1)),
    visible = true,
    rotation = 0,
  }) {
    this.position = polygon.verticies[0]
    this.polygon = polygon
    this.visible = visible
    this.rotation = rotation
  }

  render (c, camera) {
    this.polygon.translate(camera.position.x, camera.position.y)

    drawPolygon(c, this.polygon)

    this.polygon.translate(-camera.position.x, -camera.position.y)
  }
}
