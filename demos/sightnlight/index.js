import { pt, Polygon, angle3, Line, Segment, Ray, distance, angle2 } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import { importTiledMap } from '../../src/engine/importers'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'

import tileMapData from './sightnlight.json'

let tileMap = importTiledMap(tileMapData)

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))

let polyQueue = [new Polygon(pt(0, 0), pt(500, 0), pt(500, 500), pt(0, 500))]
let pointQueue = []
let rayQueue = []
let collisionQueue = []

let showRays = false
let showPolygon = true

for (let layerNames in tileMap) {
  let layer = tileMap[layerNames]
  polyQueue.push(...layer)
}

const clk = function () {
  console.log(pointQueue)
  pointQueue.push(pt(this.mouse.x, this.mouse.y))
}

engine.keyEvents[KEYS.ENTER] = _ => {
  polyQueue.push(new Polygon(...pointQueue))
  console.log(polyQueue)
  pointQueue = []
}

engine.keyEvents[KEYS.V] = _ => showPolygon = !showPolygon
engine.keyEvents[KEYS.R] = _ => showRays = !showRays

const update = function (delta) {
  collisionQueue = []
  rayQueue = []
  const offset = 0.01
  for (let poly of polyQueue) {
    for (let vertex of poly.verticies) {
      let r0 = new Ray(pt(this.mouse.x, this.mouse.y))
      r0.pointAt(vertex.x, vertex.y)
      let r1 = new Ray(pt(this.mouse.x, this.mouse.y))
      r1.pointAt(vertex.x, vertex.y)
      r1.rotateDeg(offset)
      let r2 = new Ray(pt(this.mouse.x, this.mouse.y))
      r2.pointAt(vertex.x, vertex.y)
      r2.rotateDeg(-offset)
      rayQueue.push(r0, r1, r2)
    }
  }
  
  rayQueue.sort((a, b) => {
    return angle2(a.p0, a.p1) - angle2(b.p0, b.p1)
  })

  for (let ray of rayQueue) {
    let minDist = -1
    let minInt = null
    for (let poly of polyQueue) {
      let int = ray.intersectsPoly(poly)
      if (!int) continue
      const dist = distance(ray.p0, int)
      if (minInt === null) {
        minInt = int
        minDist = dist
      } else if (dist < minDist) {
        minInt = int
        minDist = dist
      }
    }
    if (minInt)
      collisionQueue.push(minInt)
  }
}

const draw = function (c) {
  c.clearRect(0, 0, 500, 500)

  if(showRays) {
    for (let ray of rayQueue) {
      drawRay(c, ray)
    }
  }

  if (collisionQueue.length && showPolygon) {
    // Sort collisions by angle...
    const col = new Polygon(...collisionQueue)
    drawPolygon(c, col, 'white')
  }
  
  for (let i = 1; i < polyQueue.length; i++) {
    let poly = polyQueue[i]
    drawPolygon(c, poly, 'green')
  }

  if(showRays) {
    c.fillStyle = 'white'
    for (let col of collisionQueue) {
      c.fillRect(col.x - 1, col.y - 1, 3, 3)
    }
  }

  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  for (let i = 0; i < pointQueue.length; i++) {
    const x = pointQueue[i].x
    const y = pointQueue[i].y
    c.fillRect(x - 1, y - 1, 3, 3)
  }
}

engine.draw = draw
engine.update = update
engine.onClick = clk
engine.start()
