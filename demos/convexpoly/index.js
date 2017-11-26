import { pt, Polygon, ccw, angle3, Line, Segment, Ray } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))

let poly = new Polygon(pt(347, 79), pt(291, 69), pt(278, 126), pt(328, 133))

let polyQueue = []
let pointQueue = []

const clk = function () {
  console.log(pointQueue)
  pointQueue.push(pt(this.mouse.x, this.mouse.y))
}

engine.keyEvents[KEYS.ENTER] = _ => {
  polyQueue.push(new Polygon(...pointQueue))
  console.log(polyQueue)
  pointQueue = []
}
engine.keyEvents[KEYS.X] = _ => {
  if (polyQueue.length === 0)
    return
  let pts = ''
  for (let vertex of polyQueue[0].verticies) {
    pts += `pt(${vertex.x}, ${vertex.y}), `
  }
  prompt('Polygon Export', `new Polygon(${pts})`)
}
const update = function (delta) {
  if (KEYS.KEY_LEFT in this.keys) {
    poly.translate(-1, 0)
  }
  if (KEYS.KEY_RIGHT in this.keys) {
    poly.translate(1, 0)
  }
  if (KEYS.KEY_UP in this.keys) {
    poly.translate(0, -1)
  }
  if (KEYS.KEY_DOWN in this.keys) {
    poly.translate(0, 1)
  }
  if (KEYS.Q in this.keys) {
    poly.rotateDeg(poly.AABB().center(), 1)
  }
  if (KEYS.E in this.keys) {
    poly.rotateDeg(poly.AABB().center(), -1)
  }
  // console.log(this.keys)
}

const draw = function (c) {
  c.clearRect(0, 0, this.width, this.height)
  let collide = false
  for (let i = 0; i < polyQueue.length; i++) {
    const p = polyQueue[i]
    if (poly.intersectsConvexPoly(p, c)) {
      collide = true
      break
    }
  }
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  for (let i = 0; i < pointQueue.length; i++) {
    const x = pointQueue[i].x
    const y = pointQueue[i].y
    c.fillRect(x - 1, y - 1, 3, 3)
  }
  for (let i = 0; i < polyQueue.length; i++) {
    const p = polyQueue[i]
    drawPolygon(c, p, 'green')
  }
  drawPolygon(c, poly, !collide ? 'blue' : 'red')
}

engine.draw = draw
engine.update = update
engine.onClick = clk
engine.start()
