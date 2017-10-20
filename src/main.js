import { pt, Polygon, ccw, angle3, Line, Segment, Ray } from './math'
import { drawPolygon, drawLine, drawSegment, drawRay } from './engine/renderer'
import * as KEYS from './engine/keys'
import { isNode, DocumentMock, WindowMock } from './engine/isomorphic-helpers'
import Engine from './engine'

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))

let c = document.getElementById('canvas').getContext('2d')

let shape = new Polygon(pt(0, 0), pt(0, 30), pt(30, 30))

console.log(`The main point`, pt(3, 4))

console.log(`Shape of everything`, shape)

drawPolygon(c, shape)

console.log(Array(10).join('*') + 'tri' + Array(10).join('*'))

console.log(shape.perimeter(), shape.area(), ccw(shape.verticies[0], shape.verticies[1], shape.verticies[2]), shape.convex())

console.log(Array(10).join('*') + 'square' + Array(10).join('*'))

let square = new Polygon(pt(0, 0), pt(30, 0), pt(30, 30), pt(0, 30))

console.log(square.perimeter())

console.log(square.area())

console.log(square.center())

square.translate(100, 100)

drawPolygon(c, square)

console.log(Array(10).join('*') + 'ngon' + Array(10).join('*'))

let ngon = new Polygon(pt(100, 120), pt(200, 60), pt(280, 200), pt(200, 260), pt(200, 180))

console.log(ngon.perimeter(), ngon.area(), ngon.convex(), ngon.center())
drawPolygon(c, ngon)

console.log(Array(10).join('*') + 'rectangle' + Array(10).join('*'))

let rectange = new Polygon(pt(120, 180), pt(260, 180), pt(260, 240), pt(120, 240))

console.log(rectange.area(), rectange.center(), rectange.minPoints(), rectange.verticies)

console.log(angle3(pt(80, 40), pt(0, 0), pt(180, 60)))

console.log(angle3(pt(120, 180), pt(260, 180), pt(260, 240)))

drawPolygon(c, rectange)

rectange.translate(200, 0)

console.log(Array(10).join('*') + 'Lines' + Array(10).join('*'))

let line = new Ray(pt(30, 30), pt(40, 40))
drawLine(c, line)
let line2 = new Line(pt(400, 20), pt(430, 100))
drawLine(c, line2)
let seg = new Segment(pt(50, 15), pt(70, 20))
drawSegment(c, seg)
let ray = new Ray(pt(20, 200), pt(50, 250))
drawRay(c, ray)

console.log('Intersection: ', line.intersectsLine(line2))

console.log(Array(10).join('*') + 'Intersections' + Array(10).join('*'))

let intPoly = new Polygon(pt(0, 0), pt(40, 0), pt(40, 40), pt(0, 40))

console.log(
    intPoly.intersectsPt(pt(20, 20)),
    intPoly.intersectsPt(pt(30, 30)),
    intPoly.intersectsPt(pt(40, 40)),
    intPoly.intersectsPt(pt(50, 50))
)

// engine.keyEvents[84] = _ => rectange.moveToZero()
// engine.keyEvents[81] = _ => { line.p1.x = engine.mouse.x; line.p1.y = engine.mouse.y}
// engine.keyEvents[82] = _ => { line.p0.x = engine.mouse.x; line.p0.y = engine.mouse.y}
const update = function (delta) {
  if (KEYS.KEY_UP in this.keys) {
    rectange.translate(0, -1)
  }
  if (KEYS.KEY_DOWN in this.keys) {
    rectange.translate(0, 1)
  }
  if (KEYS.KEY_LEFT in this.keys) {
    rectange.translate(-1, 0)
  }
  if (KEYS.KEY_RIGHT in this.keys) {
    rectange.translate(1, 0)
  }
  if (KEYS.Q in this.keys) {
    line.rotate(.1)
  }
  if (KEYS.E in this.keys) {
    line.rotate(-.1)
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
  let rectColor = rectange.intersectsPt(mouse) ? 'blue' : 'green'
  // if (rectange.intersectsPoly(ngon)) { rectColor = 'red' }
  drawPolygon(c, rectange, rectColor)
  drawPolygon(c, ngon, ngon.intersectsPt(mouse) ? 'blue' : 'green')
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
