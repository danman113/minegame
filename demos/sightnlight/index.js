import { pt, Polygon, angle3, Line, Segment, Ray, distance, angle2, radToDeg, degToRad } from '../../src/math'
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

let visibilityPolygon = new Polygon(pt(250, 250), pt(20,20), pt(20, 20))
const reAngleVisibility = (lower, higher, tpoint) => {
  let center = visibilityPolygon.verticies[0] = tpoint
  const length = 0xfff
  let left = visibilityPolygon.verticies[1]
  const ldx = Math.cos(lower) * length
  const ldy = Math.sin(lower) * length
  left.x = center.x + ldx
  left.y = center.y + ldy
  let right = visibilityPolygon.verticies[2]
  const rdx = Math.cos(higher) * length
  const rdy = Math.sin(higher) * length
  right.x = center.x + rdx
  right.y = center.y + rdy
  const voffset = -5
  visibilityPolygon.translate(
    Math.cos((lower + higher) / 2) * voffset,
    Math.sin((lower + higher) / 2) * voffset
  )
}

let polyQueue = [new Polygon(pt(0, 0), pt(500, 0), pt(500, 500), pt(0, 500))]
let pointQueue = []
let rayQueue = []
let collisionQueue = []

let showRays = false
showRays = false
let showPolygon = true
let firstDeg = 0, lastDeg = 360

for (let layerNames in tileMap) {
  let layer = tileMap[layerNames]
  polyQueue.push(...layer)
}

polyQueue.push(visibilityPolygon)

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
engine.keyEvents[KEYS.TWO] = _ => lastDeg = 120
engine.keyEvents[KEYS.NINE] = _ => lastDeg = 90

const update = function (delta) {

  if (KEYS.Q in this.keys) {
    firstDeg += 1
    lastDeg += 1
  }
  if (KEYS.E in this.keys) {
    firstDeg -= 1
    lastDeg -= 1
  }
  if (KEYS.SHIFT in this.keys) {
    if (lastDeg < 360) {
      lastDeg++
    }
  }
  if (KEYS.CTRL in this.keys) {
    if (lastDeg > 0) {
      lastDeg--
    }
  }

  collisionQueue = []
  rayQueue = []
  const offset = 0.2

  reAngleVisibility(degToRad(firstDeg), degToRad(lastDeg), pt(this.mouse.x, this.mouse.y))
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

  // Pretty sure this makes polygon ccw, look into this for generative polygons
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

  if (collisionQueue.length && showPolygon) {
    // Sort collisions by angle...
    const col = new Polygon(...collisionQueue)
    drawPolygon(c, col, 'white')
  }

  for (let i = 1; i < polyQueue.length; i++) {
    let poly = polyQueue[i]
    if (poly === visibilityPolygon)
      continue
    drawPolygon(c, poly, 'green')
  }

  if (showRays) {
    for (let ray of rayQueue) {
      drawRay(c, ray)
    }
  }

  if(showRays) {
    c.fillStyle = 'blue'
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
