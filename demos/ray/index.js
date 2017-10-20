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

let line = new Ray(pt(30, 30), pt(40, 40))
drawLine(c, line)
let line2 = new Line(pt(400, 20), pt(430, 100))
drawLine(c, line2)
let seg = new Segment(pt(50, 15), pt(70, 20))
drawSegment(c, seg)
let ray = new Ray(pt(20, 200), pt(50, 250))
drawRay(c, ray)

const update = function (delta) {
  if (KEYS.Q in this.keys) {
    line.rotateDeg(1)
  }
  if (KEYS.E in this.keys) {
    line.rotateDeg(-1)
  }
  if (this.mouse.left) {
    line.p1.x = engine.mouse.x; line.p1.y = engine.mouse.y
  }
  if (this.mouse.right) {
    line.p0.x = engine.mouse.x; line.p0.y = engine.mouse.y
  }
  // console.log(this.keys)
}

const draw = function (c) {
  let mouse = pt(this.mouse.x, this.mouse.y)
  c.clearRect(0, 0, 500, 300)
  drawRay(c, line)
  drawLine(c, line2)
  let inter = line.intersectsSegment(line2)
  // console.log(inter)
  if (inter != null) {
    c.fillStyle = 'white'
    c.fillRect(inter.x - 1, inter.y - 1, 3, 3)
  }
  drawSegment(c, seg)
  drawRay(c, ray)
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

engine.draw = draw
engine.update = update
engine.start()
