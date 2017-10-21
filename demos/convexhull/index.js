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

let c = document.getElementById('canvas').getContext('2d')

let poly = new Polygon(pt(100, 120), pt(200, 60), pt(280, 200), pt(200, 260), pt(200, 180))

let polyQueue = []
let pointQueue = []
let hullQueue = []

const clk = function () {
  console.log(pointQueue)
  pointQueue.push(pt(this.mouse.x, this.mouse.y))
}

engine.keyEvents[KEYS.ENTER] = _ => {
  polyQueue.push(new Polygon(...pointQueue))
  console.log(polyQueue)
  pointQueue = []
}

engine.keyEvents[KEYS.H] = _ => {
  hullQueue = []
  polyQueue.map(poly => hullQueue.push(poly.generateConvexHull()))
  console.log(hullQueue)
}

const update = function (delta) {
  // console.log(this.keys)
}

const draw = function (c) {
  let mouse = pt(this.mouse.x, this.mouse.y)
  c.clearRect(0, 0, 500, 300)
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  for (var i = 0; i < pointQueue.length; i++) {
    const x = pointQueue[i].x
    const y = pointQueue[i].y
    c.fillRect(x - 1, y - 1, 3, 3)
  }

  hullQueue.map(p => {
    drawPolygon(c, p, 'blue')
  })

  for (var i = 0; i < polyQueue.length; i++) {
    const p = polyQueue[i]
    drawPolygon(c, p, 'green')
  }
}

engine.draw = draw
engine.update = update
engine.onClick = clk
engine.start()
