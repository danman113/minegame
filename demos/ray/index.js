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

let engine = new Engine(document.getElementById('canvas'), 500, 300)

let line = new Ray(pt(30, 30), pt(40, 40))
let line2 = new Line(pt(400, 20), pt(430, 100))
let seg = new Segment(pt(50, 15), pt(70, 20))
let ray = new Ray(pt(20, 200), pt(50, 250))

let poly = new Polygon(pt(100, 120), pt(200, 60), pt(280, 200), pt(200, 260), pt(200, 180))
poly.translate(140, 100)
poly.rotateDeg(poly.AABB().center(), 40)

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
  c.clearRect(0, 0, this.width, this.height)
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
  drawPolygon(c, poly, 'green')
  inter = line.intersectsPoly(poly)
  if (inter != null) {
    c.fillStyle = 'white'
    c.fillRect(inter.x - 1, inter.y - 1, 3, 3)
  }
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

engine.draw = draw
engine.update = update
engine.start()
