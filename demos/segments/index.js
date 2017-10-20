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

let seg = new Segment(pt(50, 15), pt(70, 20))
let seg2 = new Line(pt(400, 20), pt(430, 100))

const update = function (delta) {
  if (this.mouse.left) {
    seg.p1.x = engine.mouse.x; seg.p1.y = engine.mouse.y
  }
  if (this.mouse.right) {
    seg.p0.x = engine.mouse.x; seg.p0.y = engine.mouse.y
  }
  // console.log(this.keys)
}

const draw = function (c) {
  let mouse = pt(this.mouse.x, this.mouse.y)
  c.clearRect(0, 0, 500, 300)
  drawSegment(c, seg)
  drawSegment(c, seg2)
  let inter = seg.intersectsSegment(seg2)
  // console.log(inter)
  if (inter != null) {
    c.fillStyle = 'red'
    c.fillRect(inter.x - 1, inter.y - 1, 3, 3)
  }
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

engine.draw = draw
engine.update = update
engine.start()
