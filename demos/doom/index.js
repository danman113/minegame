import { pt, Polygon, angle3, Line, Segment, Ray, distance, angle2, radToDeg, degToRad } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import { importTiledMap } from '../../src/engine/importers'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'

import tileMapData from './doom.json'

let tileMap = importTiledMap(tileMapData)

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))
let rayEngine = new Engine(document.getElementById('canvas2'))


let polyQueue = [new Polygon(pt(0, 0), pt(500, 0), pt(500, 500), pt(0, 500))]
let pointQueue = []
let rayQueue = []
let collisionQueue = []

let showRays = true
let showPolygon = true
let firstDeg = 0, lastDeg = 90

const rayCast = (c) => {
  const maxDist = 500
  const maxHeight = 500
  const width = 5
  c.fillStyle = 'red'
  c.clearRect(0, 0, 500, 500)
  console.log('============================')
  for(let i = 0; i < rayQueue.length; i++) {
    const ray = rayQueue[i]
    const col = collisionQueue[i]
    if(!col) continue
    let dist = distance(ray.p0, col)
    const offset = Math.cos(degToRad((rayQueue.length) - i * 2))
    dist = dist * offset
    let heightRatio = (500 - Math.min(dist, maxDist))/maxDist
    let height = heightRatio * maxHeight
    c.fillStyle = "rgba(255, 0, 0, " + (heightRatio * heightRatio) + ")"
    c.fillRect(i * width, maxHeight/2 - height/2, width, height)
  }
}

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
engine.keyEvents[KEYS.TWO] = _ => lastDeg = 120
engine.keyEvents[KEYS.NINE] = _ => { firstDeg += 90;lastDeg += 90 }

const update = function (delta) {
  
  if (KEYS.Q in this.keys) {
    firstDeg += 1
    lastDeg += 1
  }
  if (KEYS.E in this.keys) {
    firstDeg -= 1
    lastDeg -= 1
  }
  
  collisionQueue = []
  rayQueue = []
  const offset = 0.2
  
  const mouse = pt(this.mouse.x, this.mouse.y)
  
  for(let i = firstDeg; i < lastDeg; i++) {
    let ray = new Ray(mouse)
    ray.rotateDeg(i)
    // ray.angle = angle
    ray.z = i
    rayQueue.push(ray)
  }

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
  
  for (let i = 1; i < polyQueue.length; i++) {
    let poly = polyQueue[i]
    drawPolygon(c, poly, 'green')
  }
  
  rayCast(rayEngine.context)
  
  // // console.log('++++++++')
  // for(let i = 0; i < rayQueue.length; i++) {
  //   const ray = rayQueue[i]
  //   const col = collisionQueue[i]
  //   const dist = distance(ray.p0, col)
  //   const angle = angle2(ray.p1, ray.p0)
  //   console.log(angle)
  //   const dx = ray.p0.x + (Math.cos(angle) * dist) 
  //   const dy = ray.p0.y //+ (Math.sin(angle) * dist)
  //   const newDist = distance(pt(dx, dy), col)
  //   c.fillStyle = "rgba(0, 0, 255, " + 1 + ")"
  //   c.fillRect(dx - 2, dy - 2, 5, 5)
  //   drawRay(c, {p0: pt(dx, dy), p1: col}, 'yellow')
  //   // ray.p0.x -= Math.cos(angle2(ray.p0, col)) * distance(ray.p0, col)
  // }

  if(showRays) {
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

rayEngine.start()