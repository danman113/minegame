import { pt, Polygon } from 'math'
import { drawPolygon } from 'engine/renderer'
import settings from '../settings'

const drawTexturedPolygon = (c, camera, poly, texture, e, geo) => {
  // c.fillStyle = color
  let images = e.state.imageLoader.images
  c.strokeStyle = geo.strokeColor || 'white'
  c.lineWidth = geo.strokeLength || 0
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
  if (geo.stretch || settings.state.textureStretch) {
    c.drawImage(images[texture], box.x, box.y, box.width, box.height)
  } else {
    let imageWidth = geo.tileSize * (images[texture].height / images[texture].width)
    let imageHeight = geo.tileSize * (images[texture].height / images[texture].width)
    let x = Math.ceil(box.width / imageWidth)
    let y = Math.ceil(box.height / imageHeight)
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        c.drawImage(images[texture], Math.floor(box.x + i * imageWidth), Math.floor(box.y + j * imageHeight), imageWidth, imageHeight)
      }
    }
  }

  c.fill()
  if (global.debug || geo.strokeLength) {
    // c.stroke()
  }
  c.restore()
}

export default class Geometry {
  constructor ({
    polygon = new Polygon(pt(0, 0), pt(0, 1), pt(1, 1)),
    visible = true,
    rotation = 0,
    texture = 'wall',
    strokeLength = 0,
    strokeColor = null,
    tileSize = 512,
    stretch = false
  }) {
    this.position = polygon.verticies[0]
    this.polygon = polygon
    this.rotation = rotation
    this.visible = visible
    this.strokeLength = strokeLength
    this.strokeColor = strokeColor
    this.texture = texture
    this.tileSize = tileSize
    this.stretch = stretch
  }

  render (c, camera, e) {
    global.camera = camera
    if (!this.visible) return
    this.polygon.translate(camera.position.x, camera.position.y)

    if (this.texture) {
      drawTexturedPolygon(c, camera, this.polygon, this.texture, e, this)
    } else {
      drawPolygon(c, this.polygon)
    }

    this.polygon.translate(-camera.position.x, -camera.position.y)
  }
}

export const segmentIntersectsGeometry = (seg, geometry) => {
  let inter = null
  for (let i = 0, size = geometry.length; i < size; i++) {
    inter = geometry[i].polygon.intersectsSegment(seg)
    if (inter) break
  }
  return inter
}
